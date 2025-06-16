/* eslint-disable react/prop-types */
const Error = ({ errorCode, title, message, redirectLink }) => {
  return (
    <div className="container-fluid text-center">
      <h1 className="mb-2 mx-2" style={{ fontSize: '150px' }}>
        {errorCode}
      </h1>
      <h4 className="mb-2 fs-1">{title} ⚠️</h4>
      <p className="mb-4 mx-2 fs-1">{message}</p>
      <div className="d-flex justify-content-center mt-5">
        <div className="d-flex flex-column align-items-center">
          <div>
            <a href={redirectLink} className="btn btn-primary my-4">
              Retour à la page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
