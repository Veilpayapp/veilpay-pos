const NumPad = ({ value, onChange }: { value: string; onChange: (newValue: string) => void }) => {
  const keys = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];

  const handlePress = (k: string) => {
    if (k === '⌫') {
      const newVal = value.slice(0, -1);
      onChange(newVal === '' ? '0' : newVal);
    } else if (k === '.') {
      if (!value.includes('.')) onChange(value + '.');
    } else {
      if (value === '0') {
        onChange(k);
      } else if (value.length < 7) {
        onChange(value + k);
      }
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', width: '100%' }}>
      {keys.map(k => (
        <button
          key={k}
          onClick={() => handlePress(k)}
          style={{
            width: '100%',
            height: '72px',
            background: '#1A1A2E',
            color: 'white',
            fontSize: '28px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 80ms'
          }}
          onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.94)'}
          onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {k}
        </button>
      ))}
    </div>
  );
};

export default NumPad;
