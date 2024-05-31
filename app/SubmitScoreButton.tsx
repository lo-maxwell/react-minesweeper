'use client'
import { useState } from "react";
import { addEntry } from "./api/leaderboard/addEntry/route";

export function SubmitScoreButton({showSubmitScore, setShowSubmitScore, time, boardSettings}: {showSubmitScore: number, setShowSubmitScore: Function, time: number, boardSettings: {width: number, height: number, numBombs: number}}) {
	const [name, setName] = useState("Anonymous");

	function getDifficulty(width: number, height: number, numBombs: number) {
		if (width == 9 && height == 9 && numBombs == 10) {
			return "Beginner";
		} else if (width == 16 && height == 16 && numBombs == 40) {
			return "Intermediate";
		} else if (width == 30 && height == 16 && numBombs == 99) {
			return "Expert";
		} 
		return "Custom";
	}
	
	function submitScore() {
		setShowSubmitScore(2);
		const submit = async () => {
			const scoreData = {id: 0, username: name, time: time, difficulty: getDifficulty(boardSettings.width, boardSettings.height, boardSettings.numBombs)};
			try {
				const data = await addEntry(scoreData);
				console.log(data);
				setShowSubmitScore(3);
			} catch (error) {
				console.error('Error adding to database:', error);
				setShowSubmitScore(4);
			}
		  };
	  
		  submit();
	}
	
	function renderSubmitScore () {
		if (getDifficulty(boardSettings.width, boardSettings.height, boardSettings.numBombs) == "Custom") {
			return <button className='bg-gray-300 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'>Cannot submit score for custom boards</button>
		}
		if (showSubmitScore == 1) {
		  return <button onClick={submitScore} className='bg-gray-300 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'>Submit score to leaderboard</button>
		} else if (showSubmitScore == 2) {
		  return <button className='bg-gray-300 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'>Submitting...</button>
		} else if (showSubmitScore == 3) {
			return <button className='bg-gray-300 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'>Score submitted!</button>
		} else if (showSubmitScore == 4) {
			return <button className='bg-gray-300 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'>Error submitting score!</button>
		}
		return <></>;
	  }

	if (showSubmitScore == 0) {
		return <></>;
	}
	return <>
	<div className="flex justify-center items-center space-x-4 py-2">
		<input
			type="text"
			value={name}
			maxLength={30}
			onChange={(e) => setName(e.target.value)}
			className="border rounded px-4 py-2 text-black"
			placeholder="Enter your name"
		/>
		{renderSubmitScore()}
	</div>
	</>;
}