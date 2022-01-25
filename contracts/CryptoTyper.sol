// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract CryptoTyper is Ownable {
    
    using SafeMath for uint256;
    
    event DifficultyUpdated(uint difficulty);
    event NewGame(uint id, address player, uint bet);
    event EndGame(uint id, address player, bool result, uint payout);

    struct Game {
        uint id;
        uint bet; 
        uint reward;
        address player;
        bool completed;
    }

    uint public difficulty;
    uint public reservedBalance; 
    uint public gameCount;
    mapping(uint => Game) public games;

    constructor() {
        setDifficulty(40);
    }

    receive() external payable {}

    fallback() external payable {}

    modifier gameExists(uint _id) {
        require(games[_id].id != 0, "Invalid game ID.");
        _;
    }

    function setDifficulty(uint _difficulty) public onlyOwner {
        difficulty = _difficulty;
        emit DifficultyUpdated(difficulty);
    }

    function newGame() public payable {
        uint bet = msg.value;
        uint reward = bet.mul(2);
        uint currentBalance = address(this).balance;
        require(msg.value != 0, "Payment required.");
        require((currentBalance - reservedBalance) > reward, "Insufficient contract balance.");

        reservedBalance += reward;

        gameCount++;
        games[gameCount] = Game(gameCount, bet, reward, msg.sender, false);
        emit NewGame(gameCount, msg.sender, bet);
    }

    function endGame(uint _id, bool _win) public gameExists(_id) onlyOwner {
        Game storage game = games[_id];
        require(game.completed == false, "Game already ended.");

        uint reward;
        if (_win == true) {
            payable(game.player).transfer(game.reward);
            reward = game.reward;
        } else {
            reward = 0;
        }
        reservedBalance -= game.reward;
        game.completed = true;
        emit EndGame(game.id, game.player, _win, reward);
    }

    function withdrawAll() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
        assert(address(this).balance == 0);
    }

    function contractBalance() public view returns(uint) {
        return address(this).balance;
    }

}