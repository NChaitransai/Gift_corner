import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search gifts..." }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ paddingRight: '2.5rem' }}
      />
      <Search
        size={18}
        style={{
          position: 'absolute',
          right: '0.85rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-muted)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default SearchBar;
