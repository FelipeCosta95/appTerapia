import { Component } from '@angular/core';
import { ModalController, App, ViewController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UsersProvider } from './../../providers/users/users';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-activate-game',
  templateUrl: 'activate-game.html',
})
export class ActivateGamePage {
  public game: any;
  public identifier: string;
  public firstGame: string = '1';
  public secondGame: string = '2';
  public thirdGame: string = '3';
  public fourthGame: string = 'F';
  public time: string = "";
  public imersiveMode: string = 'T';

  constructor(public app: App, public modalCtrl: ModalController, public navCtrl: NavController, public viewCtrl: ViewController, public storage: Storage, public navParams: NavParams, private toast: ToastController, private userProvider: UsersProvider) {
    this.identifier = navParams.get('identifier');
    this.game = navParams.get('game');
  }

  setConfigMercearia(firstGame: string, secondGame: string, thirdGame: string, fourthGame: string) {
    let _config = firstGame + ',' + secondGame + ',' + thirdGame + ',' + fourthGame;
    return _config;
  }
  setConfigBloquinho(firstGame: string, secondGame: string, thirdGame: string) {
    let _config = firstGame + ',' + secondGame + ',' + thirdGame;
    return _config;
  }
  setConfigPontes(firstGame: string, secondGame: string) {
    let _config = firstGame + ',' + secondGame;
    return _config;
  }
  setConfigBola(firstGame: string) {
    let _config = firstGame;
    return _config;
  }
  setConfigNave(firstGame: string) {
    let _config = firstGame;
    return _config;
  }
  activate(identifier: string, game: any) {
    return new Promise((resolve, reject) => {
      var config,
        _time;

      if (game.title == 'Bola na Caixa') {
        config = this.setConfigBola(this.firstGame);
        _time = "";
      }
      if (game.title == 'Jogo da Mercearia') {
        config = this.setConfigMercearia(this.firstGame, this.secondGame, this.thirdGame, this.fourthGame);
        _time = this.time;
      }
      if (game.title == 'Invasão Espacial') {
        config = this.setConfigNave(this.firstGame);
        _time = "";
      }
      if (game.title == 'Bloquinho') {
        config = this.setConfigBloquinho(this.firstGame, this.secondGame, this.thirdGame);
        _time = this.time;
      }
      if (game.title == 'Pontes') {
        config = this.setConfigPontes(this.firstGame, this.secondGame);
        _time = this.time;
      }

      this.checkNumber(_time, game.title)
        .then(() => {
          this.userProvider.addGames(identifier, config, game.gameID, _time, this.imersiveMode)
            .then((result: any) => {
              if (result.success === true) {
                this.viewCtrl.dismiss()
                  .then(() => {
                    this.navCtrl.popToRoot();
                    this.toast.create({ message: 'Jogo Ativado !', position: 'botton', duration: 2000 }).present();
                    resolve();
                  })
              }
              if (result.success === false) {
                this.navCtrl.popToRoot();
                this.toast.create({ message: 'Jogo já foi ativado para o paciente !', position: 'botton', duration: 5000 }).present();
              }
            })
            .catch((error: any) => {
              reject(error);
              this.toast.create({ message: 'Erro: ' + error.error, position: 'botton', duration: 5000 }).present();
            });
        })
        .catch(e => this.toast.create({ message: e, position: 'botton', duration: 5000 }).present());
    });
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  checkNumber(time: string, gameTitle: string) {
    return new Promise((resolve, reject) => {
      //if string is a number and not empty, return true
      var isFixedString = (s: string) => !isNaN(+s) && isFinite(+s) && !/e/i.test(s) && s.length > 0;
      if (!isFixedString(time) && gameTitle === 'Jogo da Mercearia') {
        reject('Insira um número válido !')
      }
      else {
        resolve();
      }
    })
  }

}
