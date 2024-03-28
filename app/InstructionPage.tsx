import React, { useEffect } from 'react'

export function InstructionPage({showInstructions, setShowInstructions}: {showInstructions: boolean, setShowInstructions: Function}) {
	const handleClickOutside = (event: any) => {
		const target = event.target as HTMLElement;
		const configElement = document.querySelector('.instruction-page');
		// Check if the click occurred outside the target element
		if (configElement && !configElement.contains(target)) {
			setShowInstructions(false);
		}
	  };

	useEffect(() => {
	// Add event listener when the component mounts
	document.body.addEventListener('click', handleClickOutside);

	// Remove event listener when the component unmounts
	return () => {
		document.body.removeEventListener('click', handleClickOutside);
	};
	}, [showInstructions]); // Only re-run the effect if showInstructions changes

	return (
		<div className={`${showInstructions ? `` : `hidden`} fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 `}>
			<div className="instruction-page bg-white pt-4 p-8 rounded-lg shadow-md justify-between items-center overflow-x-auto">
			<div className="text-2xl font-bold text-center pb-4">How to Play Minesweeper</div>
			<div><strong>Objective:</strong> The objective of Minesweeper is to clear a rectangular board containing hidden mines without detonating any of them.</div>
			<div><strong>Grid:</strong> The board consists of a grid of squares. Each square can either be empty or contain a mine.</div>
			<div><strong>Gameplay:</strong></div>
			<ul className="list-disc ml-4">
				<li>The game begins with all squares hidden.</li>
				<li>The player reveals squares by clicking on them.</li>
				<li>If a revealed square contains a mine, the game ends, and the player loses.</li>
				<li>If a revealed square does not contain a mine, it displays a number indicating how many adjacent squares contain mines.</li>
				<li>If a revealed square has no adjacent mines, it reveals all adjacent squares recursively.</li>
			</ul>
			<div><strong>Flagging:</strong> Players can flag squares they suspect contain mines using right mouse click, preventing them from being revealed. </div>
			<div>To flag with left mouse click, turn on Flag Mode at the top of the screen.</div>
			<div><strong>Winning:</strong> The player wins the game by revealing all non-mine squares without detonating any mines.</div>
			</div>
		</div>
	);
}