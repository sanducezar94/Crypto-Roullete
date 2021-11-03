// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.9;
pragma experimental ABIEncoderV2;

interface IStdReference {
    /// A structure returned whenever someone requests for standard reference data.
    struct ReferenceData {
        uint256 rate; // base/quote exchange rate, multiplied by 1e18.
        uint256 lastUpdatedBase; // UNIX epoch of the last time when base price gets updated.
        uint256 lastUpdatedQuote; // UNIX epoch of the last time when quote price gets updated.
    }

    /// Returns the price data for the given base/quote pair. Revert if not available.
    function getReferenceData(string memory _base, string memory _quote)
        external
        view
        returns (ReferenceData memory);

    /// Similar to getReferenceData, but with multiple base/quote pairs at once.
    function getReferenceDataBulk(
        string[] memory _bases,
        string[] memory _quotes
    ) external view returns (ReferenceData[] memory);
}

contract CryptoRoullete {
    struct Bet {
        uint256 roundId;
        uint256 amount;
        uint256 color;
        address player;
    }

    IStdReference ref;

    address public admin;
    uint256 public roundId;
    Bet[] public bets;
    mapping(address => uint256) public winnings;
    uint256[] public roullete = [
        20,
        3,
        2,
        3,
        2,
        3,
        2,
        5,
        2,
        3,
        2,
        3,
        2,
        3,
        2,
        5,
        2,
        3,
        2,
        3,
        2,
        3,
        2,
        3,
        2,
        5,
        2,
        3,
        2,
        3,
        2,
        3,
        2,
        2,
        5,
        2
    ];

    event Withdraw(address admin, uint256 amount);
    event Received(address payable indexed sender, uint256 amount);
    event Result(uint256 result, uint256 roundId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "caller is not the admin");
        _;
    }

    constructor(IStdReference _ref) public {
        ref = _ref;
        admin = msg.sender;
    }

    /* Allows this contract to receive payments */
    receive() external payable {
        emit Received(payable(msg.sender), msg.value);
    }

    function getPrice() external view returns (uint256) {
        IStdReference.ReferenceData memory data = ref.getReferenceData(
            "ONE",
            "USD"
        );
        return data.rate;
    }

    function getMultiPrices() external view returns (uint256[] memory) {
        string[] memory baseSymbols = new string[](3);
        baseSymbols[0] = "BTC";
        baseSymbols[1] = "ETH";
        baseSymbols[2] = "ONE";

        string[] memory quoteSymbols = new string[](3);
        quoteSymbols[0] = "USD";
        quoteSymbols[1] = "USD";
        quoteSymbols[2] = "USD";
        IStdReference.ReferenceData[] memory data = ref.getReferenceDataBulk(
            baseSymbols,
            quoteSymbols
        );

        uint256[] memory prices = new uint256[](3);
        prices[0] = data[0].rate;
        prices[1] = data[1].rate;
        prices[2] = data[2].rate;

        return prices;
    }

    function convInUsd() public view returns (uint256) {
        IStdReference.ReferenceData memory data = ref.getReferenceData(
            "ONE",
            "USD"
        );
        uint256 oneUsd = data.rate;
        uint256 convUsd = oneUsd / 10**18;
        return uint256(convUsd);
    }

    function bet(
        uint256 bet,
        uint256 color,
        uint256 roundId
    ) public payable returns (bool) {
        uint256 convUsd = convInUsd();
        require(msg.value >= convUsd, "Error, msg.value must be >= $1");
        require(
            address(this).balance >= msg.value,
            "Error, insufficent balance."
        );

        bets.push(Bet(roundId, bet, color, msg.sender));

        return true;
    }

    function roulleteResult(uint256 Seed) public {
        uint256 randomResult = uint256(
            keccak256(
                abi.encode(
                    block.timestamp,
                    block.number,
                    blockhash(block.number - Seed)
                )
            )
        ) % 36;

        emit Result(randomResult, roundId);

        for (uint256 i = 0; i < bets.length; i++) {
            if (bets[i].color == roullete[randomResult]) {
                winnings[bets[i].player] +=
                    bets[i].amount *
                    roullete[randomResult];
            }
        }

        roundId++;
        delete bets;
    }

    function cashOut() public {
        address payable player = payable(msg.sender);
        uint256 amount = winnings[player];
        require(amount > 0);
        require(amount <= address(this).balance);
        winnings[player] = 0;
        player.transfer(amount);
    }

    function withdraw(uint256 amount) external onlyAdmin {
        require(
            address(this).balance >= amount,
            "Error, contract has insufficent balance"
        );
        payable(admin).transfer(amount);
        emit Withdraw(admin, amount);
    }
}
