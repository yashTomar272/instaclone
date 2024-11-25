// HelloPage Component
const HelloPage = ({ onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '80%',
          height: '80%',
          backgroundColor: 'white',
          borderRadius: '10px',
          position: 'relative',
        }}
      >
        <button
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          &times; {/* Cross Icon */}
        </button>
        <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Hello Page</h1>
      </div>
    </div>
  );
};