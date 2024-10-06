import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import VotingContract from './contracts/Voting.json'; // Path to the compiled contract JSON

const Voting = () => {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [electionName, setElectionName] = useState('');

    useEffect(() => {
        const init = async () => {
            const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = VotingContract.networks[networkId];
            const instance = new web3.eth.Contract(
                VotingContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            setContract(instance);
            const name = await instance.methods.electionName().call();
            setElectionName(name);
            const count = await instance.methods.candidatesCount().call();
            const candidatesList = [];
            for (let i = 1; i <= count; i++) {
                const candidate = await instance.methods.candidates(i).call();
                candidatesList.push(candidate);
            }
            setCandidates(candidatesList);
            setLoading(false);
        };
        init();
    }, []);

    const vote = async (candidateId) => {
        setLoading(true);
        await contract.methods.vote(candidateId).send({ from: account });
        setLoading(false);
        alert("Voted successfully!");
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>{electionName}</h1>
            <h2>Candidates:</h2>
            <ul>
                {candidates.map((candidate) => (
                    <li key={candidate.id}>
                        {candidate.name} - Votes: {candidate.voteCount}
                        <button onClick={() => vote(candidate.id)}>Vote</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Voting;
