;(function(window){
    'use strict';
    class SpottedAI {
        constructor( { imgsArea } ){
            this.imgsArea = imgsArea;
            this.modalMarkup(); // load modal markup first
            this.API_base   = 'https://spotted.ai/echobase-web/rest/images/predicate/';
            this.imgs = document.querySelectorAll(`${this.imgsArea} img`);
            this.loading = `<div class="lds-dual-ring"></div>`;
            this.popupWrap = document.querySelector('.mystery_popup');
            this.popupModal = document.querySelector('[data-popup-modal="masterylabel"]');
            this.modalCloseTrigger = document.querySelector('.popup-modal__close');
            this.bodyBlackout = document.querySelector('.body-blackout');
        }
        
        modalMarkup(){
            document.body.innerHTML += `
            <!-- Modals -->
            <div class="popup-modal-container" data-popup-modal="masterylabel">
                <i class="popup-modal__close">x</i>
                <div class="body-blackout"></div>
                <div class="popup-modal shadow">
                    <div class="mystery_popup">
                    </div>
                </div>
            </div>`;
        }

        fetchData(imgUrl){
            const url = this.API_base + encodeURIComponent(imgUrl);
            this.popupModal.classList.add('is--visible')
            this.bodyBlackout.classList.add('is-blacked-out')
            if(this.popupModal.classList.contains('is--visible')){
                document.body.classList.add('mystery_popup_active');
            }
            // preloader
            this.popupWrap.innerHTML = this.loading;
            fetch(url, {
                method: 'GET',
                // mode: 'no-cors',
                cache: 'no-cache',
                credentials: 'omit' ,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then( response => response.json())
            .then( data => {
                console.log('data', data)
                this.loadInPopup(data);
            })
        }
    
        loadInPopup(data){
            const { attachment } = data.messages[0];
            if(!attachment){
                var html = `<p>${data.messages[0].text}</p>`;
            } else {
                const photos = attachment.payload.elements;
                var html = photos.map( photo => {
                    const { buttons, image_url, title } = photo;
                    const link = buttons[0].url;
                return `<li><a href="${link}" target="__blank"><img src="${image_url}" alt="${title}" /></a></li>`;
                }).join(' ');
            }
            this.popupWrap.innerHTML = `<ul>${html}</ul>`;
        }
    }

    const init = ({ container = 'body'} = {} ) => {
        const imgsArea = 'body' === container ? container : `#${container}`;
        // initiate
        const spotted = new SpottedAI({imgsArea});

        // attach events to each images
        spotted.imgs.forEach( img => {
            const imgUrl = img.getAttribute('src');
            // wrap each image with div
            const parent = img.parentNode;
            const wrapper = document.createElement('div'); 
            wrapper.classList.add("spot-img");
            parent.replaceChild(wrapper, img);
            wrapper.appendChild(img);

            // cusor pointer to each image
            wrapper.style.cursor = 'pointer';
            
            // open popups on click
            wrapper.addEventListener('click', function(e){
                e.preventDefault();
                spotted.fetchData(imgUrl)
            });

            spotted.modalCloseTrigger.addEventListener('click', () => {
                spotted.popupModal.classList.remove('is--visible')
                spotted.bodyBlackout.classList.remove('is-blacked-out')
                document.body.classList.remove('mystery_popup_active');
            })

            spotted.bodyBlackout.addEventListener('click', () => {
                spotted.popupModal.classList.remove('is--visible')
                spotted.bodyBlackout.classList.remove('is-blacked-out')
                document.body.classList.remove('mystery_popup_active');
            })

        });
    }

    // init the library
    window.MysteryLabel = {
        init
    }

})(window);