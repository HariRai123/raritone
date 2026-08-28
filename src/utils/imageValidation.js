const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MIN_WIDTH = 300;
const MIN_HEIGHT = 500;

export function validateImageFile(file) {
  if (!file) {
    return {
      valid: false,
      message: "Please select an image.",
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: "Only JPG, PNG and WebP images are supported.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: "Image size must be less than 10 MB.",
    };
  }

  return {
    valid: true,
    message: "",
  };
}

export function validateImageDimensions(file) {
  return new Promise((resolve) => {
    const image = new Image();

    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      if (image.width < MIN_WIDTH || image.height < MIN_HEIGHT) {
        resolve({
          valid: false,
          message: "Please upload a higher-resolution full-body image.",
        });

        return;
      }

      resolve({
        valid: true,
        message: "",
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);

      resolve({
        valid: false,
        message: "The selected file is not a valid image.",
      });
    };

    image.src = objectUrl;
  });
}
