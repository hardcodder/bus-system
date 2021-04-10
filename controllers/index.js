module.exports.getIndex = (req, res, next) => {
    res.render('index/index.ejs', {
        path: '/',
        title: 'HOME'
    });
}