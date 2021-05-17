const locprod = (process.env.NODE_ENV === 'production' ? 'https://api.wecreation.be/api' : 'http://api.test/api');
export default locprod