export const handleErrorResponse = (res, error, status = 500) => {
    console.error(error);
    return res.status(status).json({ success: false, message: error.message || 'An error occurred', error });
};
