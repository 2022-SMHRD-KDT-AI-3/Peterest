// 제발되라
const modal = document.getElementById('id01')

window.onclick = function(event){
	if(event.target == modal){
		modal.style.display = "none"
	}
}