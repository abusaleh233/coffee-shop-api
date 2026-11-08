import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

export const imagePipe = (required = false) =>
  new ParseFilePipe({
    fileIsRequired: required,
    validators: [
      new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
      new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
    ],
  });
