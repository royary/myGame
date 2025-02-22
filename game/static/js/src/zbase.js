class MyGame {
    constructor(id){
        this.id = id;
        this.$my_game = $('#' + id);
        this.menu = new gameMenu(this);
        this.playground = new gamePlayground(this);
     
        this.start();
        
    }

    start(){

    }
}