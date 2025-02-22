class gameMenu{
    constructor(root){
    this.root = root;
    this.$menu = $(`
<div class="my-game-menu">
<div class="my-game-menu-field">
<div class="my-game-menu-field-item my-game-menu-field-item-single">
Single Player
</div>
<div class="my-game-menu-field-item my-game-menu-field-item-multi">
Multi Player
</div>
<div class="my-game-menu-field-item my-game-menu-field-item-settings">
settings
</div>
</div>
</div>
`);
this.root.$my_game.append(this.$menu);
    }
}class MyGame {
    constructor(id){
        this.id = id;
        this.$my_game = $('#' + id);
        this.menu = new gameMenu(this);
    }
}