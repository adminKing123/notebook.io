from django.urls import path

from notebooks.views import CreateNotebookView, RecentNotebooksView

urlpatterns = [
    path('recent/', RecentNotebooksView.as_view(), name='notebooks-recent'),
    path('', CreateNotebookView.as_view(), name='notebooks-create'),
]
