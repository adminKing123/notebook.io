from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notebooks.constants import DEFAULT_PAGE_WINDOW_SIZE
from notebooks.models import Notebook
from notebooks.serializers import (
    CreateNotebookSerializer,
    NotebookPageImageSerializer,
    NotebookPageSerializer,
    NotebookPageWindowSerializer,
    NotebookSerializer,
    SaveNotebookPageSerializer,
)
from notebooks.services import NotebookService, NotebookServiceError
from notebooks.services.page_service import PageService, PageServiceError


def _error_response(error: Exception, *, not_found_status=status.HTTP_404_NOT_FOUND):
    message = str(error)
    if 'not found' in message.lower():
        return Response({'detail': message}, status=not_found_status)
    return Response({'detail': message}, status=status.HTTP_400_BAD_REQUEST)


class RecentNotebooksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notebooks = (
            Notebook.objects.filter(owner=request.user)
            .select_related('owner')
            .order_by('-updated_at')[:7]
        )
        serializer = NotebookSerializer(notebooks, many=True)
        return Response(serializer.data)


class CreateNotebookView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = CreateNotebookSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = NotebookService()

        try:
            notebook = service.create_notebook(
                owner=request.user,
                title=serializer.validated_data['title'],
                description=serializer.validated_data.get('description', ''),
                access=serializer.validated_data['access'],
                thumbnail_file=serializer.validated_data.get('thumbnail'),
            )
        except NotebookServiceError as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            NotebookSerializer(notebook).data,
            status=status.HTTP_201_CREATED,
        )


class NotebookDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, notebook_id):
        page_service = PageService()

        try:
            notebook = page_service.get_owned_notebook(
                notebook_id=notebook_id,
                user=request.user,
            )
        except PageServiceError as error:
            return _error_response(error)

        return Response(NotebookSerializer(notebook).data)


class NotebookPageWindowView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, notebook_id):
        page_service = PageService()

        try:
            notebook = page_service.get_owned_notebook(
                notebook_id=notebook_id,
                user=request.user,
            )
            center_page = int(request.query_params.get('center', 1))
            window_size = int(
                request.query_params.get('window', DEFAULT_PAGE_WINDOW_SIZE),
            )
            window_data = page_service.get_page_window(
                notebook=notebook,
                center_page=center_page,
                window_size=window_size,
            )
        except (PageServiceError, ValueError) as error:
            return _error_response(error)

        serializer = NotebookPageWindowSerializer(
            {
                'total_pages': window_data['total_pages'],
                'center_page': window_data['center_page'],
                'window': window_data['window'],
                'pages': window_data['pages'],
            },
        )
        return Response(serializer.data)

    def post(self, request, notebook_id):
        page_service = PageService()

        try:
            notebook = page_service.get_owned_notebook(
                notebook_id=notebook_id,
                user=request.user,
            )
            page = page_service.create_page(notebook=notebook)
        except PageServiceError as error:
            return _error_response(error)

        return Response(
            NotebookPageSerializer(page).data,
            status=status.HTTP_201_CREATED,
        )


class NotebookPageDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, notebook_id, page_id):
        page_service = PageService()
        serializer = SaveNotebookPageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            page = page_service.get_owned_page(
                notebook_id=notebook_id,
                page_id=page_id,
                user=request.user,
            )
            saved_page = page_service.save_page(
                page=page,
                payload=serializer.validated_data,
            )
        except PageServiceError as error:
            return _error_response(error)

        return Response(NotebookPageSerializer(saved_page).data)

    def delete(self, request, notebook_id, page_id):
        page_service = PageService()

        try:
            page = page_service.get_owned_page(
                notebook_id=notebook_id,
                page_id=page_id,
                user=request.user,
            )
            page_service.delete_page(page=page)
        except PageServiceError as error:
            return _error_response(error)

        return Response(status=status.HTTP_204_NO_CONTENT)


class NotebookPageImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, notebook_id, page_id):
        page_service = PageService()
        image_file = request.FILES.get('image')

        if image_file is None:
            return Response(
                {'detail': 'Image file is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            page = page_service.get_owned_page(
                notebook_id=notebook_id,
                page_id=page_id,
                user=request.user,
            )
            image = page_service.upload_page_image(page=page, image_file=image_file)
        except PageServiceError as error:
            return _error_response(error)

        return Response(
            NotebookPageImageSerializer(image).data,
            status=status.HTTP_201_CREATED,
        )
