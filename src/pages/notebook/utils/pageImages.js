import { createId } from '../../../utils/createId';
import {
  createDefaultImageLayout,
  createStaggeredImageLayout,
} from '../../../components/NotebookPage/images/utils/imageLayout';

export function buildLibraryPlacements(apiImages) {
  return apiImages.map((apiImage, index) => {
    const aspectRatio = apiImage.aspect_ratio > 0 ? apiImage.aspect_ratio : 1;

    return {
      id: createId(),
      imageId: apiImage.id,
      src: apiImage.url,
      ...createStaggeredImageLayout(aspectRatio, index),
    };
  });
}

export function buildUploadingPlacement({ placementId, src, aspectRatio }) {
  return {
    id: placementId,
    imageId: null,
    src,
    ...createDefaultImageLayout(aspectRatio),
    uploading: true,
  };
}

export function buildUploadedPlacement({ placementId, uploadedImage, aspectRatio }) {
  const layout = createDefaultImageLayout(aspectRatio);

  return {
    id: placementId,
    imageId: uploadedImage.id,
    src: uploadedImage.url,
    ...layout,
  };
}
