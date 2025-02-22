//Game Engine

let MY_GAME_OBJECT = [];
class myGameObject {
    constructor(){
        MY_GAME_OBJECT.push(this);

        this.has_called_start = false; //indicate whether or not this object has excute start() or not
        this.timedelta = 0;  //time difference between current frame and last frame, ms
    }
    strat(){ //only excute once at the first frame

    }

    update() { // excute once in every frame

    }

    on_destroy(){ // excute onece before bing destoried

    }

    destory() { // destory object
     this.on_destroy();
     for(let i = 0; i < MY_GAME_OBJECT.length; i++){
        if(MY_GAME_OBJECT[i] === this) {
            MY_GAME_OBJECT.splice(i, 1);
            break;
        }
     }
    }
}
let last_timestamp;
let MY_GAME_ANIMATION = function(timestamp) {
    for(let i = 0; i < MY_GAME_OBJECT.length; i++){
        let obj = MY_GAME_OBJECT[i];
        if(!obj.has_called_start){
            obj.strat();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(MY_GAME_ANIMATION);
}

requestAnimationFrame(MY_GAME_ANIMATION);

