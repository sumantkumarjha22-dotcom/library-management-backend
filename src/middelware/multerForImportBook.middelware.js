import multer from "multer";


const storage = multer.diskStorage({
     destination: function (req, file, cb) {
      cb(null, "./public/Import_File")
    },
})

export const Upload = multer({
    storage
})