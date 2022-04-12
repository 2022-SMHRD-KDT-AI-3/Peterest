const grids = document.querySelectorAll('.grid')
const headings = document.querySelectorAll('.heading .wrapper .text')

function enterScreen(index){
	const grid = grids[index]
	const heading = headings[index]
	const gridColumns = grid.querySelectorAll('.column')

	grid.classList.add('active')

	gridColumns.forEach(element => {
		element.classList.remove('animate-before', 'animate-after')
	})

	heading.classList.remove('animate-before', 'animate-after')
}

function exitScreen(index, delay){
	const grid = grids[index]
	const heading = headings[index]
	const gridColumns = grid.querySelectorAll('.column')

	gridColumns.forEach(element => {
		element.classList.add('animate-after')
	})

	heading.classList.add('animate-after')

	setTimeout(() => {
		grid.classList.remove('active')
	}, delay)
}

function setupAnimationCycle({timeOnScreen, delay}){
	const cycleTime = timeOnScreen + delay
	let nextIndex = 0

	function nextCycle(){
		const currentIndex = nextIndex

		enterScreen(currentIndex)

		setTimeout(() => exitScreen(currentIndex, delay), timeOnScreen)

		nextIndex = nextIndex >= grids.length - 1 ? 0 : nextIndex + 1
	}

	nextCycle()

	setInterval(nextCycle, cycleTime)
}

setupAnimationCycle({
	timeOnScreen: 4000,
	delay: 200 * 7
})