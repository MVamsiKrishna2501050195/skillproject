-- Seed data for LMS
-- Users (password is hashed for demo purposes, original: password123)
INSERT IGNORE INTO users (id, name, email, password, role, created_at) VALUES
(1, 'Prof. Sarah Johnson', 'sarah@lms.com', '$2a$10$slYQmyNdGzTn7ZLBwKRe3OYRql3yW.E9O9uP05A7M5X2uL6s2V6.a', 'INSTRUCTOR', NOW()),
(2, 'Dr. Michael Chen', 'michael@lms.com', '$2a$10$slYQmyNdGzTn7ZLBwKRe3OYRql3yW.E9O9uP05A7M5X2uL6s2V6.a', 'INSTRUCTOR', NOW()),
(3, 'Alice Student', 'alice@lms.com', '$2a$10$slYQmyNdGzTn7ZLBwKRe3OYRql3yW.E9O9uP05A7M5X2uL6s2V6.a', 'STUDENT', NOW()),
(4, 'Bob Learner', 'bob@lms.com', '$2a$10$slYQmyNdGzTn7ZLBwKRe3OYRql3yW.E9O9uP05A7M5X2uL6s2V6.a', 'STUDENT', NOW());

-- Courses
INSERT IGNORE INTO courses (id, title, description, category, thumbnail, instructor_id, created_at) VALUES
(1, 'Complete Java Masterclass', 'Learn Java from zero to hero. This comprehensive course covers Core Java, OOP, Collections, Streams, and Advanced Topics with hands-on projects.', 'Programming', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400', 1, NOW()),
(2, 'React.js for Beginners', 'Master React.js from scratch. Build modern, interactive UIs with components, hooks, state management, and real-world projects.', 'Web Development', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', 1, NOW()),
(3, 'Data Science with Python', 'Comprehensive Data Science course covering NumPy, Pandas, Matplotlib, Machine Learning, and Deep Learning with Python.', 'Data Science', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', 2, NOW()),
(4, 'Spring Boot Essentials', 'Build production-ready REST APIs with Spring Boot, JPA, Security, and deploy to cloud platforms.', 'Backend', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', 2, NOW());

-- Lessons for Java Course
INSERT IGNORE INTO lessons (id, title, content, order_index, duration_minutes, course_id) VALUES
(1, 'Introduction to Java', 'Java is a high-level, class-based, object-oriented programming language developed by James Gosling at Sun Microsystems in 1995.\n\n## Key Features\n- Platform Independent\n- Object Oriented\n- Robust and Secure\n- Multi-threaded\n\n## Setting Up\n1. Download JDK from Oracle\n2. Set JAVA_HOME environment variable\n3. Verify with java -version', 1, 30, 1),
(2, 'Variables and Data Types', 'Java has two categories of data types:\n\n## Primitive Types\n- int - 32-bit integer\n- long - 64-bit integer\n- double - 64-bit floating point\n- boolean - true/false\n- char - single character\n\n## Reference Types\n- String, Arrays, Classes', 2, 45, 1),
(3, 'Object-Oriented Programming', 'OOP is the core of Java programming.\n\n## Four Pillars\n1. Encapsulation - Wrapping data and methods together\n2. Inheritance - Acquiring properties from parent class\n3. Polymorphism - Same method, different behaviors\n4. Abstraction - Hiding implementation details', 3, 60, 1),
(4, 'Collections Framework', 'The Collections Framework provides a unified architecture for representing and manipulating collections.\n\n## Key Interfaces\n- List - Ordered collection (ArrayList, LinkedList)\n- Set - No duplicate elements (HashSet, TreeSet)\n- Map - Key-value pairs (HashMap, TreeMap)', 4, 50, 1);

-- Lessons for React Course
INSERT IGNORE INTO lessons (id, title, content, order_index, duration_minutes, course_id) VALUES
(5, 'Getting Started with React', 'React is a JavaScript library for building user interfaces.\n\n## Why React?\n- Component-based architecture\n- Virtual DOM for performance\n- Huge ecosystem\n- Strong community', 1, 30, 2),
(6, 'Components and Props', 'Components are the building blocks of React applications.\n\n## Function Components\nFunction components are the simplest way to write a React component.\n\n## Props\n- Read-only data passed from parent to child\n- Enable component reusability\n- Can pass any JavaScript expression', 2, 45, 2),
(7, 'State and Hooks', 'Hooks let you use state and lifecycle features in function components.\n\n## useState\nManages local component state.\n\n## useEffect\nHandles side effects like data fetching.\n\n## Rules of Hooks\n- Only call at the top level\n- Only call in React functions', 3, 60, 2);

-- Lessons for Data Science
INSERT IGNORE INTO lessons (id, title, content, order_index, duration_minutes, course_id) VALUES
(8, 'Python for Data Science', 'Python is the most popular language for data science.\n\n## Essential Libraries\n- NumPy - Numerical computing\n- Pandas - Data manipulation\n- Matplotlib - Data visualization\n- Scikit-learn - Machine learning', 1, 40, 3),
(9, 'Data Analysis with Pandas', 'Pandas is a fast, powerful, and flexible data analysis library.\n\n## Key Concepts\n- DataFrame and Series\n- Reading CSV files\n- Filtering and Grouping\n- Merging DataFrames', 2, 50, 3);

-- Lessons for Spring Boot
INSERT IGNORE INTO lessons (id, title, content, order_index, duration_minutes, course_id) VALUES
(10, 'Spring Boot Basics', 'Spring Boot simplifies Spring application development.\n\n## Features\n- Auto-configuration\n- Standalone applications\n- Embedded servers\n- No XML configuration', 1, 35, 4),
(11, 'REST APIs with Spring', 'Build RESTful web services with Spring Boot.\n\n## Annotations\n- @RestController - REST controller\n- @GetMapping - Handle GET requests\n- @PostMapping - Handle POST requests\n- @RequestBody - Bind request body', 2, 45, 4);

-- Quizzes
INSERT IGNORE INTO quizzes (id, title, course_id) VALUES
(1, 'Java Fundamentals Quiz', 1),
(2, 'React Basics Quiz', 2);

-- Questions for Java Quiz (using actual Hibernate column names: optiona, optionb, optionc, optiond)
INSERT IGNORE INTO questions (id, text, optiona, optionb, optionc, optiond, correct_answer, quiz_id) VALUES
(1, 'Which of the following is NOT a primitive data type in Java?', 'int', 'String', 'boolean', 'char', 'B', 1),
(2, 'What is the correct way to create an object in Java?', 'Object obj = new Object;', 'Object obj = new Object();', 'Object obj = Object();', 'new Object obj;', 'B', 1),
(3, 'Which keyword is used to inherit a class in Java?', 'implements', 'inherits', 'extends', 'super', 'C', 1),
(4, 'What does JVM stand for?', 'Java Very Much', 'Java Virtual Machine', 'Java Visual Mode', 'Java Version Manager', 'B', 1),
(5, 'Which collection does NOT allow duplicate elements?', 'ArrayList', 'LinkedList', 'HashSet', 'Vector', 'C', 1);

-- Questions for React Quiz
INSERT IGNORE INTO questions (id, text, optiona, optionb, optionc, optiond, correct_answer, quiz_id) VALUES
(6, 'What hook is used to manage state in React?', 'useEffect', 'useState', 'useContext', 'useReducer', 'B', 2),
(7, 'What is JSX?', 'A database query language', 'A syntax extension for JavaScript', 'A CSS framework', 'A testing library', 'B', 2),
(8, 'How do you pass data from parent to child component?', 'Using state', 'Using props', 'Using context', 'Using refs', 'B', 2),
(9, 'What is the Virtual DOM?', 'A real DOM copy', 'A lightweight JavaScript representation of the DOM', 'A browser feature', 'A React component', 'B', 2);

-- Enrollments
INSERT IGNORE INTO enrollments (id, student_id, course_id, enrolled_at) VALUES
(1, 3, 1, NOW()),
(2, 3, 2, NOW()),
(3, 4, 1, NOW());
