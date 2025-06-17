pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICollateralToken is IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

interface ILoanToken is IERC20 {
    function mint(address to, uint256 amount) external;
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract LendingProtocol {
    ICollateralToken public collateralToken;
    ILoanToken public loanToken;

    uint256 public constant COLLATERAL_RATIO = 150; // 150%
    uint256 public constant LOAN_RATIO = 66; // 66%
    uint256 public constant INTEREST = 5; // 5% fijo

    struct Position {
        uint256 collateral;
        uint256 debt;
        uint256 interest;
    }

    mapping(address => Position) public positions;

    constructor(address _collateral, address _loan) {
        collateralToken = ICollateralToken(_collateral);
        loanToken = ILoanToken(_loan);
    }

    function depositCollateral(uint256 amount) external {
        require(amount > 0, "Monto invalido");
        require(collateralToken.transferFrom(msg.sender, address(this), amount), "Fallo transferencia");
        positions[msg.sender].collateral += amount;
    }

    function borrow(uint256 amount) external {
        Position storage p = positions[msg.sender];
        require(p.collateral > 0, "No hay colateral");
        require(p.debt == 0, "Deuda existente");
        uint256 maxLoan = (p.collateral * LOAN_RATIO) / 100;
        require(amount <= maxLoan, "Excede limite");
        p.debt = amount;
        loanToken.mint(msg.sender, amount);
    }

    function repay() external {
        Position storage p = positions[msg.sender];
        require(p.debt > 0, "Sin deuda");
        uint256 interestAmount = (p.debt * INTEREST) / 100;
        uint256 totalRepay = p.debt + interestAmount;
        require(loanToken.transferFrom(msg.sender, address(this), totalRepay), "Fallo repago");
        p.interest += interestAmount;
        p.debt = 0;
    }

    function withdrawCollateral() external {
        Position storage p = positions[msg.sender];
        require(p.debt == 0, "Deuda activa");
        require(p.collateral > 0, "Sin colateral");
        uint256 amount = p.collateral;
        p.collateral = 0;
        require(collateralToken.transfer(msg.sender, amount), "Fallo retiro");
    }

    function getUserData(address user) external view returns (uint256, uint256, uint256) {
        Position memory p = positions[user];
        return (p.collateral, p.debt, p.interest);
    }
}