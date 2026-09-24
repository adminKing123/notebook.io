import { useParams } from 'react-router-dom';
import Notebook from '../../components/Notebook';
import Spinner from '../../components/ui/Spinner';
import { useNotebookEditor } from './hooks/useNotebookEditor';
import './notebook-page.css';

export default function NotebookPage() {
  const { id } = useParams();
  const {
    pages,
    setPages,
    totalPages,
    isLoading,
    isWindowLoading,
    isSaving,
    error,
    handlePageIndexChange,
    handleContentChange,
    handleUpdateImage,
    handleImportImage,
    handleImportExistingImages,
    handleDeleteImage,
    handleAddPage,
    handleRemovePage,
  } = useNotebookEditor(id);

  if (isLoading) {
    return (
      <div className="notebook-page-route">
        <Spinner
          size="lg"
          centered
          centerLayout="notebook-page-route__loading"
          label="Loading notebook"
        />
      </div>
    );
  }

  if (error && pages.length === 0) {
    return (
      <div className="notebook-page-route">
        <p className="notebook-page-route__error" role="alert">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="notebook-page-route">
      {error && (
        <p className="notebook-page-route__error notebook-page-route__error--inline" role="alert">
          {error}
        </p>
      )}

      <Notebook
        key={id}
        pages={pages}
        setPages={setPages}
        totalPages={totalPages}
        isWindowLoading={isWindowLoading}
        isSaving={isSaving}
        onPageIndexChange={handlePageIndexChange}
        onContentChange={handleContentChange}
        onImportImage={handleImportImage}
        onImportExistingImages={handleImportExistingImages}
        onUpdateImage={handleUpdateImage}
        onDeleteImage={handleDeleteImage}
        onAddPageRequest={handleAddPage}
        onRemovePageRequest={handleRemovePage}
      />
    </div>
  );
}
