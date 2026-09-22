import Spinner from '../ui/Spinner';
import NotebookPage from '../NotebookPage';

export default function NotebookPagesViewport({
  pages,
  currentPageIndex,
  pageRefs,
  viewportRef,
  selectedImageId,
  onSelectImage,
  onUpdateImage,
  onImportImage,
  onContentChange,
}) {
  return (
    <div className="notebook__pages-viewport" ref={viewportRef}>
      {pages.map((page, index) => (
        <div
          key={page.id}
          ref={(element) => {
            pageRefs.current[index] = element;
          }}
          className="notebook__page"
        >
          {page.loading ? (
            <div className="notebook__page-loading">
              <Spinner size="md" label="Loading page" />
            </div>
          ) : (
            <NotebookPage
              title={page.title}
              subtitle={page.subtitle}
              content={page.content}
              autoFocusContent={index === 0 && currentPageIndex === 0}
              images={page.images}
              selectedImageId={index === currentPageIndex ? selectedImageId : null}
              onSelectImage={index === currentPageIndex ? onSelectImage : undefined}
              onUpdateImage={index === currentPageIndex ? onUpdateImage : undefined}
              onImportImage={index === currentPageIndex ? onImportImage : undefined}
              onContentChange={
                onContentChange ? (content) => onContentChange(index, content) : undefined
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}
