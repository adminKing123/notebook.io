from django.urls import path

from notebooks.views import (
    CreateNotebookView,
    NotebookDetailView,
    NotebookPageDetailView,
    NotebookPageImageUploadView,
    NotebookPageWindowView,
    RecentNotebooksView,
)

urlpatterns = [
    path('recent/', RecentNotebooksView.as_view(), name='notebooks-recent'),
    path('', CreateNotebookView.as_view(), name='notebooks-create'),
    path('<uuid:notebook_id>/', NotebookDetailView.as_view(), name='notebook-detail'),
    path(
        '<uuid:notebook_id>/pages/',
        NotebookPageWindowView.as_view(),
        name='notebook-pages-window',
    ),
    path(
        '<uuid:notebook_id>/pages/<uuid:page_id>/',
        NotebookPageDetailView.as_view(),
        name='notebook-page-detail',
    ),
    path(
        '<uuid:notebook_id>/pages/<uuid:page_id>/images/',
        NotebookPageImageUploadView.as_view(),
        name='notebook-page-image-upload',
    ),
]
