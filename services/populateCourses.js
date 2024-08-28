import { db } from '../src/app.js';
import { courses } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

const coursesData = [
  {
    title: 'PC Architecture',
    description: 'Dive into the internal architecture of personal computers. Learn to identify key components and understand their functions through AR visualizations.',
    image: 'https://as1.ftcdn.net/v2/jpg/06/69/40/52/1000_F_669405248_bH5WPZiAFElWP06vqlPvj2qWcShUR4o8.jpg',
    category: 'Technology',
    difficulty: 'Intermediate',
    rating: 4.5
  },
  {
    title: 'Car Engines',
    description: 'Discover the inner workings of car engines. This course uses VR to visually explain each part of the engine and how they work together to power a vehicle.',
    image: 'https://as2.ftcdn.net/v2/jpg/05/61/83/21/1000_F_561832197_hFNpE81YcD1DWkekEGgr7UmyAdhF7yor.jpg',
    category: 'Automotive',
    difficulty: 'Intermediate',
    rating: 4.3
  },
  {
    title: 'Human Anatomy',
    description: 'Study human anatomy in a fully immersive VR environment. Explore detailed 3D models of the human body and learn about various systems and organs interactively.',
    image: 'https://as2.ftcdn.net/v2/jpg/07/22/71/49/1000_F_722714979_cGdzp7YPXbR9UdTDUmO2NurSbdoMv0nD.jpg',
    category: 'Biology',
    difficulty: 'Advanced',
    rating: 4.8
  },
  {
    title: 'Building and Construction',
    description: 'Learn the fundamentals of building and construction. Use AR to visualize structures, understand construction techniques, and see how different materials are used.',
    image: 'https://as2.ftcdn.net/v2/jpg/01/43/62/11/1000_F_143621122_2YtgdzvfSRBtMrBv2oGY2kJgcoWD2aGv.jpg',
    category: 'Engineering',
    difficulty: 'Intermediate',
    rating: 4.2
  },
  {
    title: 'Exploring Solar Systems',
    description: 'Travel through space and explore our solar system in a VR setting. Understand the characteristics of planets, moons, and other celestial bodies.',
    image: 'https://as1.ftcdn.net/v2/jpg/07/47/47/28/1000_F_747472813_BRc5sJyx8ARzzMKVktx20MATlKUfupNh.jpg',
    category: 'Astronomy',
    difficulty: 'Beginner',
    rating: 4.7
  },
  {
    title: 'Robotics Mechanics',
    description: 'Learn the basics of robotics mechanics with augmented reality. See how robots are designed, built, and programmed, and explore all the possibilities.',
    image: 'https://as2.ftcdn.net/v2/jpg/07/83/26/95/1000_F_783269593_jXtGuD0zCDkM3MoAQue4C7lxqn4tPauE.jpg',
    category: 'Technology',
    difficulty: 'Advanced',
    rating: 4.6
  },
  {
    title: 'Physics',
    description: 'Conduct virtual physics experiments in a VR environment. Explore the principles of physics, from classical mechanics to electromagnetism, and understand the miracles around us.',
    image: 'https://as1.ftcdn.net/v2/jpg/03/15/93/12/1000_F_315931249_rSi7bow4pS1nueeoQqpEG57IkPiFisZQ.jpg',
    category: 'Science',
    difficulty: 'Advanced',
    rating: 4.4
  }
];

async function populateCourses() {
  try {
    console.log('Connecting to the database...');
    
    console.log('Updating courses...');
    for (const course of coursesData) {
      const existingCourse = await db.select().from(courses).where(eq(courses.title, course.title)).limit(1);
      
      if (existingCourse.length > 0) {
        await db.update(courses)
          .set({ 
            description: course.description, 
            image: course.image,
            category: course.category,
            difficulty: course.difficulty,
            rating: course.rating
          })
          .where(eq(courses.title, course.title));
        console.log(`Updated course: ${course.title}`);
      } else {
        await db.insert(courses).values(course);
        console.log(`Inserted new course: ${course.title}`);
      }
    }
    
    console.log('Courses updated successfully!');
  } catch (error) {
    console.error('Error updating courses:', error);
  } finally {
    process.exit(0);
  }
}

populateCourses();
