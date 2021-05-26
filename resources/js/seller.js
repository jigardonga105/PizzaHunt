import axios from 'axios'
import Noty from 'noty'


let deleteBtn = document.querySelectorAll(".delete-img-btn");

export function handleStore() {
    deleteImg();

    function reload() {
        reload = location.reload();
    }

    function deleteConfirm(imgId) {
        axios.post(`/deleteImg/${imgId}`)
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

    async function deleteImg() {
        //This is for Delete item image
        if (deleteBtn) {

            for (let i = 0; i < deleteBtn.length; i++) {


                deleteBtn[i].addEventListener('click', (e) => {

                    let item = JSON.parse(deleteBtn[i].dataset.item)
                    if (item) {

                        for (let j = 0; j < item.length; j++) {

                            for (let k = 0; k < item[j].image.length; k++) {

                                if (item[j].image[k]._id === deleteBtn[i].value) {

                                    let confirm = window.confirm('Are you sure you want to delete this image?')
                                    if (confirm) {
                                        console.log('ok');
                                        deleteConfirm(item[j].image[k]._id);
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