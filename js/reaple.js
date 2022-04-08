function show_1(){
    document.getElementById('datgle_box').style.display='block';
    document.getElementById('reaple_open_btn').style.display='none';
    document.getElementById('reaple_close_btn').style.display = 'block';
}
function show_2() {
    document.getElementById('datgle_box').style.display = 'none';
    document.getElementById('reaple_open_btn').style.display = 'block';
    document.getElementById('reaple_close_btn').style.display = 'none';
}
function heart_cnt(){
    document.getElementById('none_click_heart').style.display = 'none';
    document.getElementById('click_heart').style.display = 'block';
}
function heart_no_cnt() {
    document.getElementById('none_click_heart').style.display = 'block';
    document.getElementById('click_heart').style.display = 'none';
}