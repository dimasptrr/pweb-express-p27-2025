import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  console.log('👤 Seeding users...');
  const users = await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        password: 'admin123', // In production, use hashed passwords!
        email: 'admin@example.com',
      },
      {
        username: 'johndoe',
        password: 'password123',
        email: 'john@example.com',
      },
      {
        username: 'janedoe',
        password: 'password123',
        email: 'jane@example.com',
      },
      {
        username: 'bookworm',
        password: 'password123',
        email: 'reader@example.com',
      },
    ],
  });
  console.log(`✅ Created ${users.count} users`);

  // Seed Genres
  console.log('📚 Seeding genres...');
  const genres = await prisma.genre.createMany({
    data: [
      { name: 'Fiction' },
      { name: 'Non-Fiction' },
      { name: 'Science Fiction' },
      { name: 'Fantasy' },
      { name: 'Mystery' },
      { name: 'Thriller' },
      { name: 'Romance' },
      { name: 'Biography' },
      { name: 'History' },
      { name: 'Self-Help' },
    ],
  });
  console.log(`✅ Created ${genres.count} genres`);

  // Get created genres to use their IDs
  const allGenres = await prisma.genre.findMany();
  const fictionGenre = allGenres.find(g => g.name === 'Fiction')!;
  const sciFiGenre = allGenres.find(g => g.name === 'Science Fiction')!;
  const fantasyGenre = allGenres.find(g => g.name === 'Fantasy')!;
  const mysteryGenre = allGenres.find(g => g.name === 'Mystery')!;
  const biographyGenre = allGenres.find(g => g.name === 'Biography')!;
  const selfHelpGenre = allGenres.find(g => g.name === 'Self-Help')!;

  // Seed Books
  console.log('📖 Seeding books...');
  const books = await prisma.book.createMany({
    data: [
      {
        title: 'To Kill a Mockingbird',
        writer: 'Harper Lee',
        publisher: 'J. B. Lippincott & Co.',
        publicationYear: 1960,
        description: 'A gripping tale of racial injustice and childhood innocence.',
        price: 15.99,
        stockQuantity: 50,
        genreId: fictionGenre.id,
      },
      {
        title: '1984',
        writer: 'George Orwell',
        publisher: 'Secker & Warburg',
        publicationYear: 1949,
        description: 'A dystopian social science fiction novel.',
        price: 14.99,
        stockQuantity: 45,
        genreId: sciFiGenre.id,
      },
      {
        title: 'The Hobbit',
        writer: 'J.R.R. Tolkien',
        publisher: 'George Allen & Unwin',
        publicationYear: 1937,
        description: 'A fantasy novel about the adventures of Bilbo Baggins.',
        price: 18.99,
        stockQuantity: 60,
        genreId: fantasyGenre.id,
      },
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        writer: 'J.K. Rowling',
        publisher: 'Bloomsbury',
        publicationYear: 1997,
        description: 'The first novel in the Harry Potter series.',
        price: 19.99,
        stockQuantity: 100,
        genreId: fantasyGenre.id,
      },
      {
        title: 'The Da Vinci Code',
        writer: 'Dan Brown',
        publisher: 'Doubleday',
        publicationYear: 2003,
        description: 'A mystery thriller novel.',
        price: 16.99,
        stockQuantity: 35,
        genreId: mysteryGenre.id,
      },
      {
        title: 'Sherlock Holmes: The Complete Novels',
        writer: 'Arthur Conan Doyle',
        publisher: 'George Newnes',
        publicationYear: 1887,
        description: 'Collection of Sherlock Holmes novels.',
        price: 22.99,
        stockQuantity: 40,
        genreId: mysteryGenre.id,
      },
      {
        title: 'Steve Jobs',
        writer: 'Walter Isaacson',
        publisher: 'Simon & Schuster',
        publicationYear: 2011,
        description: 'The exclusive biography of Steve Jobs.',
        price: 20.99,
        stockQuantity: 30,
        genreId: biographyGenre.id,
      },
      {
        title: 'Atomic Habits',
        writer: 'James Clear',
        publisher: 'Avery',
        publicationYear: 2018,
        description: 'An easy & proven way to build good habits.',
        price: 17.99,
        stockQuantity: 55,
        genreId: selfHelpGenre.id,
      },
      {
        title: 'The Great Gatsby',
        writer: 'F. Scott Fitzgerald',
        publisher: 'Charles Scribner\'s Sons',
        publicationYear: 1925,
        description: 'A classic American novel set in the Jazz Age.',
        price: 13.99,
        stockQuantity: 65,
        genreId: fictionGenre.id,
      },
      {
        title: 'Dune',
        writer: 'Frank Herbert',
        publisher: 'Chilton Books',
        publicationYear: 1965,
        description: 'A science fiction novel about the desert planet Arrakis.',
        price: 21.99,
        stockQuantity: 42,
        genreId: sciFiGenre.id,
      },
    ],
  });
  console.log(`✅ Created ${books.count} books`);

  // Get some users and books for orders
  const allUsers = await prisma.user.findMany();
  const allBooks = await prisma.book.findMany();

  // Seed Orders with OrderItems
  console.log('🛒 Seeding orders...');
  
  // Order 1
  await prisma.order.create({
    data: {
      userId: allUsers[1].id,
      items: {
        create: [
          {
            bookId: allBooks[0].id,
            quantity: 2,
          },
          {
            bookId: allBooks[2].id,
            quantity: 1,
          },
        ],
      },
    },
  });

  // Order 2
  await prisma.order.create({
    data: {
      userId: allUsers[2].id,
      items: {
        create: [
          {
            bookId: allBooks[3].id,
            quantity: 3,
          },
        ],
      },
    },
  });

  // Order 3
  await prisma.order.create({
    data: {
      userId: allUsers[3].id,
      items: {
        create: [
          {
            bookId: allBooks[1].id,
            quantity: 1,
          },
          {
            bookId: allBooks[4].id,
            quantity: 2,
          },
          {
            bookId: allBooks[7].id,
            quantity: 1,
          },
        ],
      },
    },
  });

  console.log('✅ Created 3 orders with order items');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
