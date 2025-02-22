class gameMenu{
    constructor(root){
    this.root = root;
    this.$menu = $(`
        <div class="my-game-menu">
        <div class="my-game-menu-field">
        <div class="my-game-menu-field-item my-game-menu-field-item-single-mode">
        Single Player
        </div>
        <br>
        <div class="my-game-menu-field-item my-game-menu-field-item-multi-mode">
        Multi Player
        </div>
         <br>
        <div class="my-game-menu-field-item my-game-menu-field-item-settings">
        Settings
        </div>
        </div>
        </div>
        `);
this.root.$my_game.append(this.$menu);
this.$single_mode = this.$menu.find('.my-game-menu-field-item-single-mode');
this.$multi_mode = this.$menu.find('.my-game-menu-field-item-multi-mode');
this.$settings = this.$menu.find('.my-game-menu-field-item-settings');

this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        }); 
        this.$multi_mode.click(function(){
            console.log("click multi mode");
        });
        this.$settings.click(function(){
            console.log("click settings");
        });
    }

    show(){
        this.$menu.show();
    }

    hide(){
        this.$menu.hide();
    }
}