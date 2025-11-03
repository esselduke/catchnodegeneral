// Data
const categories = [
    { name: 'Portfolio & Agency', icon: 'fas fa-briefcase', href: '/category/portfolio' },
    { name: 'Technology', icon: 'fas fa-laptop-code', href: '/category/technology' },
    { name: 'Blog & Editorial', icon: 'fas fa-newspaper', href: '/category/blog' },
    { name: 'Professional Services', icon: 'fas fa-paint-brush', href: '/category/services' },
    { name: 'Real Estate', icon: 'fas fa-home', href: '/category/real-estate' },
    { name: 'Retail', icon: 'fas fa-store', href: '/category/retail' }
];

const featuredTemplates = [
    {
        id: 1,
        images: [
            'assets/template/ecommerce.webp',
            'assets/template/travel.webp'
        ],
        title: 'Albeit',
        industry: 'Business',
        pages: 12,
        hasBooking: true,
        rating: 4.9,
        price: '$129'
    },
    {
        id: 2,
        images: [
            'assets/template/architecture.webp',
            'assets/template/personal.webp',
            'assets/template/it.webp'
        ],
        title: 'Smart One',
        industry: 'Technology',
        pages: 8,
        hasBooking: false,
        rating: 4.8,
        price: '$99'
    },
    {
        id: 3,
        images: [
            'assets/template/food.webp',
            'assets/template/beauty.webp',
            'assets/template/community.webp'
        ],
        title: 'Evantine',
        industry: 'Events',
        pages: 15,
        hasBooking: true,
        rating: 5.0,
        price: '$149'
    },
    {
        id: 4,
        images: [
            'assets/template/photography.webp',
            'assets/template/community.webp'
        ],
        title: 'Q Studio',
        industry: 'Creative',
        pages: 10,
        hasBooking: true,
        rating: 4.7,
        price: '$119'
    }
];

const newTemplates = [
    {
        id: 5,
        images: [
            'assets/template/podcast.webp',
            'assets/template/portfolio.webp'
        ],
        title: 'APTLO',
        industry: 'Travel',
        pages: 9,
        hasBooking: true,
        rating: 4.6,
        price: '$89'
    },
    {
        id: 6,
        images: [
            'assets/template/art.webp',
            'assets/template/food.webp',
            'assets/template/architecture.webp'
        ],
        title: 'Fent',
        industry: 'Design',
        pages: 7,
        hasBooking: false,
        rating: 4.8,
        price: '$79'
    },
    {
        id: 7,
        images: [
            'assets/template/education.webp',
            'assets/template/personal.webp'
        ],
        title: 'Themgroup',
        industry: 'Business',
        pages: 11,
        hasBooking: true,
        rating: 4.9,
        price: '$109'
    },
    {
        id: 8,
        images: [
            'assets/template/services.webp',
            'assets/template/community.webp',
            'assets/template/it.webp'
        ],
        title: 'Rozanna',
        industry: 'Fashion',
        pages: 13,
        hasBooking: true,
        rating: 5.0,
        price: '$139'
    }
];

const freeTemplates = [
    {
        id: 9,
        images: [
            'assets/template/education.webp',
        ],
        title: 'Lun Dark',
        industry: 'Portfolio',
        pages: 5,
        hasBooking: false,
        rating: 4.5,
        price: 'Free'
    },
    {
        id: 10,
        images: [
            'assets/template/art.webp',
            'assets/template/services.webp'
        ],
        title: 'Syrup Tennis',
        industry: 'Sports',
        pages: 6,
        hasBooking: true,
        rating: 4.3,
        price: 'Free'
    },
    {
        id: 11,
        images: [
            'assets/template/food.webp',
            'assets/template/beauty.webp'
        ],
        title: 'Ptech',
        industry: 'Technology',
        pages: 8,
        hasBooking: false,
        rating: 4.7,
        price: 'Free'
    },
    {
        id: 12,
        images: [
            'assets/template/photography.webp',
            'assets/template/beauty.webp'
        ],
        title: 'TechTree',
        industry: 'Business',
        pages: 7,
        hasBooking: true,
        rating: 4.4,
        price: 'Free'
    }
];

// TemplateCard functionality
class TemplateCard {
    constructor(template) {
        this.template = template;
        this.currentImageIndex = 0;
        this.element = this.createCard();
    }

    getIndustryIcon(industry) {
        switch (industry.toLowerCase()) {
            case 'travel':
                return 'fas fa-globe';
            case 'business':
                return 'fas fa-file-alt';
            default:
                return 'fas fa-globe';
        }
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.template.images.length;
        this.updateSlider();
    }

    prevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.template.images.length) % this.template.images.length;
        this.updateSlider();
    }

    goToImage(index) {
        this.currentImageIndex = index;
        this.updateSlider();
    }

    updateSlider() {
        const imageContainer = this.element.querySelector('.imageContainer');
        const indicators = this.element.querySelectorAll('.indicator');

        imageContainer.style.transform = `translateX(-${this.currentImageIndex * 100}%)`;

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('indicatorActive', index === this.currentImageIndex);
        });
    }

    createCard() {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="industryIcon">
                <i class="${this.getIndustryIcon(this.template.industry)} icon"></i>
            </div>

            <div class="starRating">
                <i class="fas fa-star star"></i>
                <span class="ratingText">${this.template.rating}</span>
            </div>

            <div class="imageSlider">
                <div class="imageContainer">
                    ${this.template.images.map(image => `
                        <img src="${image}" alt="Template" class="image" />
                    `).join('')}
                </div>

                <button class="navButton prevButton">
                    <i class="fas fa-chevron-left navIcon"></i>
                </button>
                <button class="navButton nextButton">
                    <i class="fas fa-chevron-right navIcon"></i>
                </button>

                <div class="indicators">
                    ${this.template.images.map((_, index) => `
                        <button class="indicator ${index === 0 ? 'indicatorActive' : ''}"></button>
                    `).join('')}
                </div>
            </div>

            <div class="details">
                <h3 class="title">${this.template.title}</h3>

                <div class="features">
                    <div class="feature">
                        <i class="fas fa-globe featureIcon"></i>
                        <span>Industry: ${this.template.industry}</span>
                    </div>

                    <div class="feature">
                        <i class="fas fa-file-alt featureIcon"></i>
                        <span>Pages: ${this.template.pages}</span>
                    </div>

                    ${this.template.hasBooking ? `
                        <div class="feature">
                            <i class="fas fa-calendar featureIcon"></i>
                            <span>Appointment Booking</span>
                        </div>
                    ` : ''}
                </div>

                <div class="price">
                    ${this.template.price}
                </div>
            </div>
        `;

        // Add event listeners
        const prevButton = card.querySelector('.prevButton');
        const nextButton = card.querySelector('.nextButton');
        const indicators = card.querySelectorAll('.indicator');

        prevButton.addEventListener('click', () => this.prevImage());
        nextButton.addEventListener('click', () => this.nextImage());

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToImage(index));
        });

        return card;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Render categories
    const categoriesGrid = document.getElementById('categoriesGrid');
    categories.forEach(category => {
        const categoryCard = document.createElement('a');
        categoryCard.href = '/templates/all';
        categoryCard.className = 'categoryCard';
        categoryCard.innerHTML = `
            <div class="categoryImage">
                <img src="assets/template/construction-worker.webp" alt="construction" />
            </div>
            <h3 class="categoryName">${category.name}</h3>
        `;
        categoriesGrid.appendChild(categoryCard);
    });

    // Render featured templates
    const featuredContainer = document.getElementById('featuredTemplates');
    featuredTemplates.forEach(template => {
        const card = new TemplateCard(template);
        featuredContainer.appendChild(card.element);
    });

    // Render new templates
    const newContainer = document.getElementById('newTemplates');
    newTemplates.forEach(template => {
        const card = new TemplateCard(template);
        newContainer.appendChild(card.element);
    });

    // Render free templates
    const freeContainer = document.getElementById('freeTemplates');
    freeTemplates.forEach(template => {
        const card = new TemplateCard(template);
        freeContainer.appendChild(card.element);
    });
});