import { useRef } from 'react';
import { MdClose, MdUpload } from 'react-icons/md';
import AuthForm from '../../auth/shared/AuthForm';
import AuthFormMessage from '../../auth/shared/AuthFormMessage';
import FormActions from '../../ui/FormActions';

export default function ThumbnailStep({
  formData,
  updateThumbnail,
  onBack,
  onContinue,
  isSubmitting = false,
  continueLabel = 'Create Notebook',
  error = '',
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const [file] = event.target.files;

    if (!file) {
      return;
    }

    updateThumbnail(file);
  };

  const handleRemoveThumbnail = () => {
    updateThumbnail(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasThumbnail = Boolean(formData.thumbnailPreview);

  return (
    <AuthForm onSubmit={onContinue}>
      <AuthFormMessage message={error} />

      <div className="create-notebook-thumbnail">
        <input
          ref={fileInputRef}
          id="notebookThumbnail"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="create-notebook-thumbnail__input"
        />

        {hasThumbnail ? (
          <div className="create-notebook-thumbnail__preview">
            <div className="create-notebook-thumbnail__preview-frame">
              <img
                src={formData.thumbnailPreview}
                alt=""
                className="create-notebook-thumbnail__preview-image"
              />
              <button
                type="button"
                className="create-notebook-thumbnail__remove"
                aria-label="Remove image"
                title="Remove image"
                onClick={handleRemoveThumbnail}
              >
                <MdClose aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <label htmlFor="notebookThumbnail" className="create-notebook-thumbnail__picker">
            <span className="create-notebook-thumbnail__picker-icon" aria-hidden="true">
              <MdUpload />
            </span>
            <span className="create-notebook-thumbnail__picker-text">Upload thumbnail</span>
            <span className="create-notebook-thumbnail__picker-hint">PNG, JPG, or WEBP</span>
          </label>
        )}
      </div>

      <FormActions
        onBack={onBack}
        continueLabel={continueLabel}
        continueType="submit"
        onContinue={onContinue}
        isSubmitting={isSubmitting}
      />
    </AuthForm>
  );
}
