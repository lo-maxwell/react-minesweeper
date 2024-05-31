'use client'

import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getViewEntries } from '../api/leaderboard/viewEntries/route';
import { LeaderboardEntry, LeaderboardEntryComponent } from './LeaderboardEntry';

function parseLeaderboardData(data: LeaderboardEntry[]) {
	return data
		.slice(0, 25)
		.map((entry, index) => (
		<LeaderboardEntryComponent key={index} entry={entry} index={index}/>
	));
}

function filterLeaderboardData(data: LeaderboardEntry[], difficulty: string) {
	return data.filter(entry => entry.difficulty === difficulty);
}

async function getLeaderboardData(difficulty: string) {
	try {
		const response = await getViewEntries({columns: [], where: {'difficulty': difficulty}, orderBy: `time`, limit: 25})
		return response;
	  } catch (error) {
		// console.error('Error viewing database:', error);
		return null;
	  }
}

export default function Leaderboard() {
	const [showDifficulty, setShowDifficulty] = useState("Beginner");
	const [visibleEntries, setVisibleEntries] = useState<LeaderboardEntry[]| null>(null);

	function selectBeginnerDifficulty () {
		setShowDifficulty("Beginner");
	}
	function selectIntermediateDifficulty () {
		setShowDifficulty("Intermediate");
	}
	function selectExpertDifficulty () {
		setShowDifficulty("Expert");
	}

	const renderLeaderboardEntries = () => {
		if (visibleEntries != null) {
			const filteredEntries = filterLeaderboardData(visibleEntries, showDifficulty);
			if (filteredEntries.length > 0) {
				return parseLeaderboardData(filteredEntries);
			}
			return <tr><td colSpan={1} className="px-4 py-2 text-center">No leaderboard entries found.</td></tr>
		}
		return <tr><td colSpan={1} className="px-4 py-2 text-center">Loading entries...</td></tr>;

	}

	useEffect(() => {
		const fetchData = async () => {
			const data = await getLeaderboardData(showDifficulty);
			if (data != null) {
				const rows = data as LeaderboardEntry[];
				setVisibleEntries(rows);
			} else {
				setVisibleEntries(null);
			}
		}
		fetchData();
		
	  }, [showDifficulty]);

	return <>
		<div className="text-center space-y-0.5 px-8 pb-4 bg-gray-800 text-white ">
			<div className="flex">
			<div className="flex flex-1 items-center justify-start">
				
				<Link href="/">
					<button className='justify-center bg-blue-500 text-white px-2 py-2 mr-4 mt-1 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center justify-center'>
					🎮
					</button>
				</Link> 
			</div>
			<span className="flex-1 text-2xl font-bold justify-center">Leaderboard</span>
			<span className="flex flex-1 justify-end relative"></span>
			
			</div>
			<span className="flex">
			<span className="flex-1">
			
			</span>
			<div className="flex flex-5 space-x-4">
			<span className=""><button onClick={selectBeginnerDifficulty} className={`${showDifficulty == "Beginner" ? `bg-gray-200` : `bg-gray-400`} px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2`}>Beginner</button></span>
			<span className=""><button onClick={selectIntermediateDifficulty} className={`${showDifficulty == "Intermediate" ? `bg-gray-200` : `bg-gray-400`} px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2`}>Intermediate</button></span>
			<span className=""><button onClick={selectExpertDifficulty} className={`${showDifficulty == "Expert" ? `bg-gray-200` : `bg-gray-400`} px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2`}>Expert</button></span>
			</div>
			<span className="flex-1"></span>
			</span>
		</div>
		<div className="bg-blue-200 text-gray-800 min-h-screen p-4">
			<Head>
				<title className="text-white">Minesweeper Leaderboard</title>
			</Head>
			<table className="min-w-full bg-blue-300 border border-blue-500">
				<thead className="bg-blue-400 text-left">
					<tr>
						<th className="px-4 py-2 border-b border-blue-500">#</th>
						<th className="px-4 py-2 border-b border-blue-500">Username</th>
						<th className="px-4 py-2 border-b border-blue-500">Time</th>
					</tr>
				</thead>
				<tbody>
					{renderLeaderboardEntries()}
				</tbody>
			</table>
		</div>
	</>;
}