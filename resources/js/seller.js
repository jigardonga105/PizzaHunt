import axios from 'axios'
import Noty from 'noty'


let deleteItemBtn = document.querySelectorAll(".delete-img-btn");
let deleteStrBtn = document.querySelectorAll(".delete-strimg-btn");

export function handleStore() {
    deleteItemImg();
    deleteStrImg();

    function reload() {
        reload = location.reload();
    }

    function deleteConfirmStore(imgId, strID) {
        axios.post(`/deleteImgStore/${imgId}/${strID}`)
            .then(res => {
                    new Noty({
                        type: 'success',
                        timeout: 1000,
                        text: 'Image Deleted',
                        progressBar: false,
                    }).show();
                },
                reload())
            .catch(err => {
                new Noty({
                    type: 'error',
                    timeout: 1000,
                    text: 'Something went wrong',
                    progressBar: false,
                }).show();
            })
    }

    function deleteConfirmItem(imgId) {
        axios.post(`/deleteImgItem/${imgId}`)
            .then(res => {
                    new Noty({
                        type: 'success',
                        timeout: 1000,
                        text: 'Image Deleted',
                        progressBar: false,
                    }).show();
                },
                reload())
            .catch(err => {
                new Noty({
                    type: 'error',
                    timeout: 1000,
                    text: 'Something went wrong',
                    progressBar: false,
                }).show();
            })
    }

    async function deleteItemImg() {
        //This is for Delete item image
        if (deleteItemBtn) {

            for (let i = 0; i < deleteItemBtn.length; i++) {


                deleteItemBtn[i].addEventListener('click', (e) => {
                    console.log(deleteItemBtn[i]);

                    let item = JSON.parse(deleteItemBtn[i].dataset.item)
                    if (item) {

                        for (let j = 0; j < item.length; j++) {

                            for (let k = 0; k < item[j].image.length; k++) {

                                if (item[j].image[k]._id === deleteItemBtn[i].value) {

                                    let confirm = window.confirm('Are you sure you want to delete this image?')
                                    if (confirm) {
                                        console.log('ok');
                                        deleteConfirmItem(item[j].image[k]._id);
                                    } else {
                                        console.log('no');
                                    }
                                }
                            }
                        }
                    }
                })
            }
        }
    }

    async function deleteStrImg() {
        //This is for Delete item image
        if (deleteStrBtn) {

            for (let i = 0; i < deleteStrBtn.length; i++) {


                deleteStrBtn[i].addEventListener('click', (e) => {
                    console.log('clicked');

                    let item = JSON.parse(deleteStrBtn[i].dataset.item)
                    if (item) {

                        for (let j = 0; j < item.length; j++) {

                            for (let k = 0; k < item[j].image.length; k++) {

                                if (item[j].image[k]._id === deleteStrBtn[i].value) {

                                    let confirm = window.confirm('Are you sure you want to delete this image?')
                                    if (confirm) {
                                        console.log('ok');
                                        deleteConfirmStore(item[j].image[k]._id, deleteStrBtn[i].id);
                                    } else {
                                        console.log('no');
                                    }
                                }
                            }
                        }
                    }
                })
            }
        }
    }
}