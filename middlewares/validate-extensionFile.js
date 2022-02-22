const extensionsValids = ['png', 'jpg', 'jpeg', 'gif'];

const validateExtensionFile = (req, res, next) => {
    const {file} = req.files;
    const nameCut = file.name.split('.');
    const extension = nameCut[nameCut.length - 1];
    const include = extensionsValids.includes(extension);
    if (!include) {
        return res.status(400).json({
            msg: 'extension file is not valid! - validateExtensionFile'
        });
    }
    next();
}

module.exports = {
    validateExtensionFile,
}