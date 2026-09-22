import { useRef } from 'react';
import { MdImage, MdUpload } from 'react-icons/md';
import AuthForm from '../../auth/shared/AuthForm';
import AuthFormMessage from '../../auth/shared/AuthFormMessage';
import FormActions from '../../ui/FormActions';
import ThumbnailPreview from '../ThumbnailPreview';

export default function ThumbnailStep({
  formData,
  updateThumbnail,
  onBack,
  onContinue,
  isSubmitting = false,
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

  return (
    <AuthForm onSubmit={onContinue}>
      <AuthFormMessage message={error} />

      <div className="create-notebook-thumbnail">
        <div className="create-notebook-thumbnail__upload">
          <input
            ref={fileInputRef}
            id="notebookThumbnail"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="create-notebook-thumbnail__input"
          />

          <label htmlFor="notebookThumbnail" className="create-notebook-thumbnail__picker">
            <span className="create-notebook-thumbnail__picker-icon" aria-hidden="true">
              <MdUpload />
            </span>
            <span className="create-notebook-thumbnail__picker-text">
              {formData.thumbnailPreview ? 'Replace thumbnail' : 'Upload thumbnail'}
            </span>
            <span className="create-notebook-thumbnail__picker-hint">
              PNG, JPG, or WEBP
            </span>
          </label>

          {formData.thumbnailPreview && (
            <button
              type="button"
              className="create-notebook-thumbnail__remove"
              onClick={handleRemoveThumbnail}
            >
              Remove image
            </button>
          )}
        </div>

        {!formData.thumbnailPreview && (
          <div className="create-notebook-thumbnail__placeholder" aria-hidden="true">
            <MdImage />
            <span>No image selected yet</span>
          </div>
        )}
      </div>

      <ThumbnailPreview
        title={formData.title}
        description={formData.description}
        access={formData.access}
        imageSrc={formData.thumbnailPreview}
      />

      <FormActions
        onBack={onBack}
        continueLabel="Create Notebook"
        continueType="submit"
        onContinue={onContinue}
        isSubmitting={isSubmitting}
      />
    </AuthForm>
  );
}
