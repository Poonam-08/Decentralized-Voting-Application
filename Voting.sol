// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    uint public candidatesCount;
    string public electionName;

    constructor(string memory _electionName) {
        electionName = _electionName;
    }

    function addCandidate(string memory _name) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
    }

    function getResults() public view returns (uint[] memory, string[] memory) {
        uint[] memory voteCounts = new uint[](candidatesCount);
        string[] memory candidateNames = new string[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            voteCounts[i - 1] = candidates[i].voteCount;
            candidateNames[i - 1] = candidates[i].name;
        }
        return (voteCounts, candidateNames);
    }
}
