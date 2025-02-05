module.exports = ({ meta, config, managers }) => {
  return ({ req, res, next }) => {
    console.log(req);
    next(req.query);
  };
};
