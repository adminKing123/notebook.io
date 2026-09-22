from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notebooks.models import Notebook
from notebooks.serializers import CreateNotebookSerializer, NotebookSerializer
from notebooks.services import NotebookService, NotebookServiceError


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
