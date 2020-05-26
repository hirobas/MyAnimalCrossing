//変数のスコープを限定しておくと良いので、全体を即時関数で囲っておく
(() => {
    'use strict';

    const firebaseConfig = {
        //set your firebase config
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    const db = firebase.firestore();
    //Firestore version 7では不要
    /*db.settings({
    timestampsInSnapshots: true  
    });*/

    const collection = db.collection('fishes');
    const collection_in = db.collection('insects');
    const auth = firebase.auth();

    let me = null;

    const kind = document.getElementById('kind');
    const no = document.getElementById('no');
    const name = document.getElementById('name');
    const shadow = document.getElementById('shadow');
    const place = document.getElementById('place');
    const place_in = document.getElementById('place_in');
    const bell = document.getElementById('bell');
    const frto_month1 = document.getElementById('frto_month1');
    const frto_month2 = document.getElementById('frto_month2');
    const frto_hour1 = document.getElementById('frto_hour1');
    const frto_hour2 = document.getElementById('frto_hour2');
    const form = document.querySelector('form');    //formのHTML要素を作成する
    const fishes = document.getElementById('fishes');
    const login = document.getElementById('login');
    const logout = document.getElementById('logout');

    auth.onAuthStateChanged(user => {
        if(user){
            me = user;
            //fishesの最初の子要素が存在する限り、そのの子要素を削除する（全件削除）

            while(fishes.firstChild){
                fishes.removeChild(fishes.firstChild);
            }

            //firestore collectionの変更を監視する
            collection.orderBy('bell', "desc").onSnapshot(snapshot => {
                //変更結果はdocChangeで取得できる
                var table = document.createElement('table');
                let cnt = 0;
                snapshot.docChanges().forEach(change => {
                    
                    if(change.type === 'added'){
                        
                        //一覧にも投稿者がわかるようにする
                        const d = change.doc.data();
                        //月を取得
                        var today = new Date();
                        var month = Number(today.getMonth()+1);

                        //月　from-toの範囲チェック
                        let frto_target = d.frto_month1.split('-');
                        let mSts = chkRange(month,Number(frto_target[0]),Number(frto_target[1]),1);
                        
                        if(mSts==0 && d.frto_month2!==null){
                            //月1の範囲外の場合、月2のチェックをする
                            frto_target= d.frto_month2.split('-');
                            mSts = chkRange(month,Number(frto_target[0]),Number(frto_target[1]),1);
                        }
                        console.log(`mSts= ${mSts} :no_data!`);

                        //時間　from-toの範囲チェック
                        var hour = Number(today.getHours());
                        frto_target = d.frto_hour1.split('-');
                        let dSts = chkRange(hour,Number(frto_target[0]),Number(frto_target[1]),2);
                        if(dSts==0 && d.frto_hour2!==null){
                            //時間1の範囲外の場合、時間2のチェックをする
                            frto_target= d.frto_hour2.split('-');
                            mSts = chkRange(hour,Number(frto_target[0]),Number(frto_target[1]),2);
                        }
                        console.log(`dSts= ${dSts} :no_data!`);
                        
                        if(cnt==0){
                            var tr = document.createElement('tr');
                            //列の設定
                            var th2 = document.createElement('th');
                            th2.textContent = "魚のなまえ" ;
                            tr.appendChild(th2);
                            var th3 = document.createElement('th');
                            th3.textContent = "魚影";
                            tr.appendChild(th3);
                            var th4 = document.createElement('th');
                            th4.textContent = "場所";
                            tr.appendChild(th4);
                            var th5 = document.createElement('th');
                            th5.textContent = "ベル";
                            tr.appendChild(th5);
                            var th6 = document.createElement('th');
                            th6.textContent = "季節(月)1";
                            tr.appendChild(th6);
                            var th7 = document.createElement('th');
                            th7.textContent = "季節(月)2";
                            tr.appendChild(th7);
                            var th8 = document.createElement('th');
                            th8.textContent = "時間帯1";
                            tr.appendChild(th8);
                            var th9 = document.createElement('th');
                            th9.textContent = "時間帯2";
                            tr.appendChild(th9);
                            //テーブルに行を追加
                            table.appendChild(tr); 
                            cnt =1;
                        }

                        //現在の月をみて出力対象を決める
                        if(mSts==1 && dSts==1){
                            
                            var tr = document.createElement('tr');
                            //列の設定
                            var td2 = document.createElement('td');
                            td2.textContent = d.name ;
                            tr.appendChild(td2);
                            var td3 = document.createElement('td');
                            td3.textContent = getShadowName(d.shadow);
                            tr.appendChild(td3);
                            var td4 = document.createElement('td');
                            td4.textContent = getPlace(d.place);
                            tr.appendChild(td4);
                            var td5 = document.createElement('td');
                            td5.textContent = d.bell;
                            tr.appendChild(td5);
                            var td6 = document.createElement('td');
                            td6.textContent = d.frto_month1;
                            tr.appendChild(td6);
                            var td7 = document.createElement('td');
                            td7.textContent = d.frto_month2;
                            tr.appendChild(td7);
                            var td8 = document.createElement('td');
                            td8.textContent = d.frto_hour1;
                            tr.appendChild(td8);
                            var td9 = document.createElement('td');
                            td9.textContent = d.frto_hour2;
                            tr.appendChild(td9);
                            //テーブルに行を追加
                            table.appendChild(tr);
                        }
                    }
                });
                document.getElementById('maintable').appendChild(table);
                document.getElementById('maintable').style.border = "medium";
            },error => {});
            
            //虫のコレクション
            collection_in.orderBy('bell', "desc").onSnapshot(snapshot => {
                //変更結果はdocChangeで取得できる
                var table = document.createElement('table');
                let cnt = 0;
                snapshot.docChanges().forEach(change => {
                    
                    if(change.type === 'added'){
                        
                        //一覧にも投稿者がわかるようにする
                        const d = change.doc.data();
                        //月を取得
                        var today = new Date();
                        var month = Number(today.getMonth()+1);

                        //月　from-toの範囲チェック
                        let frto_target = d.frto_month1.split('-');
                        let mSts = chkRange(month,Number(frto_target[0]),Number(frto_target[1]),1);
                        
                        if(mSts==0 && d.frto_month2!==null){
                            //月1の範囲外の場合、月2のチェックをする
                            frto_target= d.frto_month2.split('-');
                            mSts = chkRange(month,Number(frto_target[0]),Number(frto_target[1]),1);
                        }
                        console.log(`mSts= ${mSts} :no_data!`);

                        //時間　from-toの範囲チェック
                        var hour = Number(today.getHours());
                        frto_target = d.frto_hour1.split('-');
                        let dSts = chkRange(hour,Number(frto_target[0]),Number(frto_target[1]),2);
                        if(dSts==0 && d.frto_hour2!==null){
                            //時間1の範囲外の場合、時間2のチェックをする
                            frto_target= d.frto_hour2.split('-');
                            mSts = chkRange(hour,Number(frto_target[0]),Number(frto_target[1]),2);
                        }
                        console.log(`dSts= ${dSts} :no_data!`);
                        
                        if(cnt==0){
                            var tr = document.createElement('tr');
                            //列の設定
                            var th2 = document.createElement('th');
                            th2.textContent = "むしのなまえ" ;
                            tr.appendChild(th2);
                            var th4 = document.createElement('th');
                            th4.textContent = "場所";
                            tr.appendChild(th4);
                            var th5 = document.createElement('th');
                            th5.textContent = "ベル";
                            tr.appendChild(th5);
                            var th6 = document.createElement('th');
                            th6.textContent = "季節(月)1";
                            tr.appendChild(th6);
                            var th7 = document.createElement('th');
                            th7.textContent = "季節(月)2";
                            tr.appendChild(th7);
                            var th8 = document.createElement('th');
                            th8.textContent = "時間帯1";
                            tr.appendChild(th8);
                            var th9 = document.createElement('th');
                            th9.textContent = "時間帯2";
                            tr.appendChild(th9);
                            //テーブルに行を追加
                            table.appendChild(tr); 
                            cnt =1;
                        }

                        //現在の月をみて出力対象を決める
                        if(mSts==1 && dSts==1){
                            
                            var tr = document.createElement('tr');
                            //列の設定
                            var td2 = document.createElement('td');
                            td2.textContent = d.name ;
                            tr.appendChild(td2);
                            var td3 = document.createElement('td');
                            td3.textContent = d.place;
                            tr.appendChild(td3);
                            var td4 = document.createElement('td');
                            td4.textContent = d.bell;
                            tr.appendChild(td4);
                            var td5 = document.createElement('td');
                            td5.textContent = d.frto_month1;
                            tr.appendChild(td5);
                            var td6 = document.createElement('td');
                            td6.textContent = d.frto_month2;
                            tr.appendChild(td6);
                            var td7 = document.createElement('td');
                            td7.textContent = d.frto_hour1;
                            tr.appendChild(td7);
                            var td8 = document.createElement('td');
                            td8.textContent = d.frto_hour2;
                            tr.appendChild(td8);
                            //テーブルに行を追加
                            table.appendChild(tr);
                        }
                    }
                });
                document.getElementById('maintable_in').appendChild(table);
                document.getElementById('maintable_in').style.border = "medium";
            },error => {});

            console.log(`Logged in as: ${user.uid}`);
            login.classList.add('hidden');
            //foreachを使って特定のクラスはhiddenを外す
            [logout,form,fishes].forEach(el =>{
                el.classList.remove('hidden');
            })
            
            no.focus();
  
            return;
            
        }
        me = null;
        console.log('Nobody is logged in');
        login.classList.remove('hidden');
        // form.classList.remove('hidden');
        //foreachを使って特定のクラスはhiddenを外す
        [logout,form,fishes].forEach(el =>{
            el.classList.add('hidden');
        });
    });

    login.addEventListener('click', () => {
        auth.signInAnonymously();
    });

    logout.addEventListener('click', () => {
        auth.signOut();
    });

    //SUBMITしたときの処理
    form.addEventListener('submit', e => {
        e.preventDefault();
        const val_kind = kind.value;
        const val_no = no.value.trim();
        const val_name = name.value.trim();
        const val_shadow = shadow.value.trim();
        const val_place = place.value.trim();
        const val_place_in = place_in.value.trim();
        const val_bell = Number(bell.value.trim());
        const val_frto_month1 = frto_month1.value.trim();
        const val_frto_month2 = frto_month2.value.trim();
        const val_frto_hour1 = frto_hour1.value.trim();
        const val_frto_hour2 = frto_hour2.value.trim();

        console.log(`val_kind= ${val_kind} :no_data!`);
        if(val_no === ""){
            return;
        }
        no.value = '';
        name.value = '';
        no.focus();

        if(val_kind=="fish"){
　          //fish collectionの操作
            // collection.add({
            //     no: val_no,
            //     name: val_name,
            //     shadow: val_shadow,
            //     place: val_place,
            //     bell: val_bell,
            //     frto_month1: val_frto_month1,
            //     frto_month2: val_frto_month2,
            //     frto_hour1: val_frto_hour1,
            //     frto_hour2: val_frto_hour2,

            //     created: firebase.firestore.FieldValue.serverTimestamp(),
            //     //条件演算子でmeがNULLのときの処理を追加
            //     uid: me ? me.uid : 'nobody'
            // })
            // .then(doc =>{
            //     console.log(`${doc.id} added!`);
            // })
            // .catch(error => {
            //     console.log('document add error!');
            //     console.log(error);
            // });
        } else {    //むしを選択したときの処理
            console.log('むしをえらんだね');
            //insects collectionの操作
            collection_in.add({
                no: val_no,
                name: val_name,
                place: val_place_in,
                bell: val_bell,
                frto_month1: val_frto_month1,
                frto_month2: val_frto_month2,
                frto_hour1: val_frto_hour1,
                frto_hour2: val_frto_hour2,

                created: firebase.firestore.FieldValue.serverTimestamp(),
                //条件演算子でmeがNULLのときの処理を追加
                uid: me ? me.uid : 'nobody'
            })
            .then(doc =>{
                console.log(`${doc.id} added!`);
            })
            .catch(error => {
                console.log('document add error!');
                console.log(error);
            });
        }
    });

})();

function chkRange(target,frval,toval,kbn){
    let rSts = 0;
    let startVal = 0;
    let endVal = 0;

    if(kbn==1){     //月の場合
        tmp_startVal = 1;
        tmp_endVal = 12;
    } else {        //時間の場合
        tmp_startVal = 0;
        tmp_endVal = 24;
    }
    console.log(`hiro target= ${target} frval= ${frval} toval= ${toval} kbn= ${kbn} tmp_startVal= ${tmp_startVal} tmp_endVal= ${tmp_endVal}`);
    //from toがひっくり返っていないかをチェックする
    if(kbn==1){     //月の場合
        if(frval > toval){
            //fromが大きい場合は開始、終了を設定してチェックする
            if(frval <= target && target <= tmp_endVal){
                rSts = 1;
            }else if(tmp_startVal <= target && target <= toval){
                rSts = 1;
            }
        }else if(frval<=target && target <= toval){
            rSts = 1;
        }
    } else {        //時間の場合は toの時間帯は含まない
        if(frval > toval){
            //fromが大きい場合は開始、終了を設定してチェックする
            if(frval <= target && target <= tmp_endVal){
                rSts = 1;
            }else if(tmp_startVal <= target && target < toval){
                rSts = 1;
            }
        }else if(frval<=target && target < toval){
            rSts = 1;
        }
    }
    //console.log(`rSts= ${rSts}`);
    return rSts;
}

function getShadowName(sKbn){
    let sName = null;
    switch(sKbn){
        case "1":
            sName="極小"
            break;
        case "2":
            sName="小"
            break;
        case "3":
            sName="中"
            break;
        case "4":
            sName="大"
            break;
        case "5":
            sName="特大"
            break;
        case "6":
            sName="細長"
            break;
        default:
            sName="背ビレ"
            break;
    }
    return sName; 
}

function getPlace(sKbn){
    let sName = null;
    switch(sKbn){
        case "1":
            sName="海"
            break;
        case "2":
            sName="川"
            break;
        case "3":
            sName="池"
            break;
        case "4":
            sName="崖の上"
            break;
        case "5":
            sName="桟橋"
            break;
        default:
            sName="河口"
            break;
    }
    return sName; 
}

