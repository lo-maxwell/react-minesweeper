export class LeaderboardEntry {
	id: number;
	username: string;
	time: number;
	difficulty: string;

	constructor(id: number, username: string, time: number, difficulty: string) {
		this.id = id;
		this.username = username;
		this.time = time;
		this.difficulty = difficulty;
	}

	// getEntry() {
	// 	return {
	// 		id: this.id,
	// 		username: this.username,
	// 		time: this.time,
	// 		difficulty: this.difficulty
	// 	};
	// }
}

export const LeaderboardEntryComponent = ({ entry, index } : {entry: {username: string, time: number, difficulty: string}, index: number}) => {
	const getBackgroundColor = () => {
		if (index === 0) return 'bg-yellow-300';
		if (index === 1) return 'bg-gray-300';
		if (index === 2) return 'bg-yellow-600';
		return index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-50';
	}

	const getRankMedal = () => {
		if (index === 0) return '🥇';
		if (index === 1) return '🥈';
		if (index === 2) return '🥉';
		return index+1;
	}
	
	return (
		<tr className={getBackgroundColor()}>
			<td className="px-4 py-2">{getRankMedal()}</td>
			<td className="px-4 py-2">{entry.username}</td>
			<td className="px-4 py-2">{entry.time}</td>
		</tr>
	);
}