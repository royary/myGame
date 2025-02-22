class gamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div> Game Start</div>`);
        this.hide();
        this.root.$my_game.append(this.$playground);

        this.start();
    }

    start() {

    }

    show() {
        this.$playground.show();
    }

    hide() {
        this.$playground.hide();
    }
}