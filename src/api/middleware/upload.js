import multer from 'multer'

module.exports = {
    upload: multer({
        dest: './uploads',
    }),
}