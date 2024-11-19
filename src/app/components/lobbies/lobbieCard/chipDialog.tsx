import React, { useEffect } from 'react';

interface ChipDialogProps {
  show: boolean;
  chips: number;
  setChips: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: () => void;
  onClose: () => void;
}

const ChipDialog: React.FC<ChipDialogProps> = ({ show, chips, setChips, onSubmit, onClose }) => {
  // Reset chips value when the dialog is closed
  useEffect(() => {
    if (!show) {
      setChips(0); // Reset the value when closing the dialog
    }
  }, [show, setChips]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow digits, handle empty input and delete characters
    if (/^\d*$/.test(value)) {
      setChips(Number(value) || 0); // Update chips value based on the input
    }
  };

  const handleSubmit = () => {
    if (chips >= 100) {
      onSubmit(); // Proceed if valid
    } else {
      alert('You must have at least 100 chips to join the game.');
    }
  };

  if (!show) return null;

  return (
    <div className="dialog fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold text-white">Enter Chips</h3>
        <input
          type="text"
          value={chips || ''}
          onChange={handleChange}
          placeholder="Enter chips (min 100)"
          className="mt-4 w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg"
        />
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
          <button
            onClick={() => {
              setChips(0);  // Clear the input field when closing
              onClose();
            }}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChipDialog;
