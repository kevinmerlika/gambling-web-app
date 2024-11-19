import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';


type PokerTableProps = {
  lobbyType:'premium' | 'regular' | 'vip' | 'classic' | 'luxury';
  lobbyId: number;
  socket: Socket;
};
const PokerTable: React.FC<PokerTableProps> = ({ lobbyType, lobbyId, socket }) => {
  const [seats, setSeats] = useState([
    { id: 1, isOccupied: false },
    { id: 2, isOccupied: false },
    { id: 3, isOccupied: false },
    { id: 4, isOccupied: false },
    { id: 5, isOccupied: false },
    { id: 6, isOccupied: false },
    { id: 7, isOccupied: false },
    { id: 8, isOccupied: false },
  ]);


  const [timer, setTimer] = useState(60); // Set initial timer to 60 seconds
  const [potAmount, setPotAmount] = useState(0); // Set initial pot amount

  // Handle seat joining
  const handleJoinSeat = (seatId: number) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId ? { ...seat, isOccupied: true } : seat
      )
    );
  };

  // Set table color based on lobby type
  let tableColor: string;
  switch (lobbyType) {
    case 'premium':
      tableColor = 'linear-gradient(145deg, #5e2b97, #ab63db)';
      break;
    case 'vip':
      tableColor = 'linear-gradient(145deg, #ff6347, #e52b50)';
      break;
    case 'classic':
      tableColor = 'linear-gradient(145deg, #7c4b1f, #e5a967)';
      break;
    case 'luxury':
      tableColor = 'linear-gradient(145deg, #0c3b6d, #2a75bb)';
      break;
    default:
      tableColor = 'linear-gradient(145deg, #3a835e, #64a479)';
      break;
  }

  // Timer functionality
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Poker Table features (logo, timer, pot amount)
  return (
    <div className="poker-table" style={{ background: tableColor }}>
      {/* Poker Table Logo */}
      {/* <div className="table-logo">
        <img src="/assets/poker-logo.png" alt="Poker Logo" />
      </div> */}

      {/* Timer */}
      <div className="table-timer">
        <span>Time Left: {timer}s</span>
      </div>

      {/* Pot Amount */}
      <div className="table-pot">
        <span>Pot: ${potAmount}</span>
      </div>

      {/* Lobby Label */}
      <div className="lobby-label">
        <span>{lobbyType} TABLE</span>
      </div>

      {/* Seats */}
      {seats.map((seat) => (
        <div
          key={seat.id}
          className={`seat seat-${seat.id}`}
          onClick={() => handleJoinSeat(seat.id)}
        >
          <div className="seat-text">
            {!seat.isOccupied ? 'Sit' : 'Occupied'}
          </div>
          {seat.isOccupied && (
            <div className="player-cards">
              <div className="player-card back-of-card"></div>
              <div className="player-card back-of-card"></div>
            </div>
          )}
        </div>
      ))}

      {/* Community Cards */}
      <div className="community-cards">
        <div className="community-card back-of-card"></div>
        <div className="community-card back-of-card"></div>
        <div className="community-card back-of-card"></div>
        <div className="community-card back-of-card"></div>
        <div className="community-card back-of-card"></div>
      </div>

      {/* Center Chip Placeholder */}
      <div className="center-chip-placeholder"></div>

      {/* Bet Area
      <div className="bet-area">
        <span>Place Your Bets</span>
      </div> */}
    </div>
  );
};

export default PokerTable;
