const autoCompleteConfig = {
    renderOption(photo) {
        const imgSrc = photo.src.tiny === 'N/A' ? '' : photo.src.tiny; 
        return `
        <img src="${imgSrc}" />
        <h5> ${photo.alt} by: ${photo.photographer}</h5>
        `;
    }, 
    inputValue(photo){
        return photo.photographer; 
    }, 
    async fetchData(searchTerm) {
        const response = await axios.get('https://api.pexels.com/v1/search', {
            params: {
                Authorization: '563492ad6f917000010000018ecb400f0b0945338ac816145eba6a31',
                query: searchTerm
            }
        });
        if (response.data.Error){
            return []; 
        }
    
        return response.data.photos; 
    }
};

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'), 
    onOptionSelect(photo) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onPhotoSelect(photo, document.querySelector('#left-summary'), 'left');
    }, 
});
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'), 
    onOptionSelect(photo) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onPhotoSelect(photo, document.querySelector('#right-summary'), 'right');
    }, 
});

let leftPhoto; 
let rightPhoto; 
const onPhotoSelect = async (photo, summaryElement, side) => {
    const response = await axios.get('https://api.pexels.com/v1/photos/', {
        params: {
            id: photo.id,
            Authorization: '563492ad6f917000010000018ecb400f0b0945338ac816145eba6a31',
            
        }
    });

    console.log(photo.id)
    
    summaryElement.innerHTML = photoTemplate(response.data);

    if (side === 'left'){
        leftPhoto = response.data; 
    } else {
        rightPhoto = response.data; 
    }

    if (leftPhoto && rightPhoto){
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index)=>{
        const rightStat = rightSideStats[index];
        
        const leftSideValue = parseInt(leftStat.dataset.value); 
        const rightSideValue = parseInt(rightStat.dataset.value); 

        if (leftSideValue > rightSideValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning')
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning')
        }
    });
};
 
const photoTemplate = (photoDetail) => {
    const dollars = parseInt(photoDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(photoDetail.Metascore);
    const imbdRating = parseFloat(photoDetail.imdbRating);
    const imdbVotes = parseFloat(photoDetail.imdbVotes.replace(/,/g, ''));

 
    const awards = photoDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        if(isNaN(value)){
            return prev; 
        } else{
            return prev + value; 
        }
    }, 0)
    
    

    return `
        <article class="media>
            <figure class="media-left">
                <p class="image">
                    <img src="${photo.src.large}"/>
                </p>

            </figure> 
        </article>

        <article>
        <div class="media-content">
                <div class="content">
                    <h1>${photoDetail.photographer}</h1>
                    <h4>${photoDetail.photographer_url}</h4>
                    <p>${photoDetail.alt}</p>
                </div>
        </div>
        </article>
    `;
};