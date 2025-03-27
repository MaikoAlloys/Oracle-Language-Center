-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 27, 2025 at 08:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oracle_language_centre`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `password`) VALUES
(1, 'admin', '1234');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `fee` int(11) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `duration`, `fee`, `description`) VALUES
(1, 'Kikuyu Language', '3 months', 5000, 'Learn to speak and write Kikuyu fluently.'),
(2, 'Swahili Language', '4 months', 6000, 'Comprehensive Swahili course for beginners.'),
(3, 'Arabic Language', '6 months', 8000, 'Master Arabic with our expert trainers.'),
(4, 'Gikuyu Classes', '3 months', 5000, 'Our Gikuyu language lessons target both children and adults, Kenyan or foreigners designed for all, from beginners to advanced learners.'),
(5, 'Luhya Classes', '3 months', 5000, 'It doesn\'t matter the Luhya sub-language you want to learn, we\'ve got native speaking tutors who will help exceed your goals.'),
(6, 'Kalenjin Classes', '3 months', 5000, 'Interested in learning Kalenjin? We offer Kalenjin classes in Nairobi Kenya physically or online for either group or private students.'),
(7, 'Luo Classes', '3 months', 5000, 'Whether you want to improve your Luo language skills or start learning for the first time, join our Luo classes today.'),
(8, 'Kamba Classes', '3 months', 5000, 'You will learn how to communicate in Kamba in a variety of daily situations, taught by our native Kamba teachers.'),
(9, 'Swahili Classes', '4 months', 6000, 'Highly personalised and designed course to improve your Swahili language and communication skills.'),
(10, 'Arabic Classes', '6 months', 8000, 'Learn Arabic online or at our school. Courses for all levels, beginners to advanced. Evening and weekend classes available.'),
(11, 'English Classes', '4 months', 7000, 'Our course will help improve your English language skills which are essential for travel, work purposes or simply for personal interest.'),
(12, 'French Classes', '5 months', 7500, 'We guide you all the way from beginner to fluent. Teaching people from all walks of life and all nationalities.'),
(13, 'Spanish Classes', '5 months', 7500, 'Want to study Spanish? Start private Spanish lessons, group Spanish lessons or online Spanish lessons.'),
(14, 'Chinese Classes', '6 months', 8500, 'Learn and study with us. We provide beginner to advanced level Chinese language lessons.');

-- --------------------------------------------------------

--
-- Table structure for table `finance_managers`
--

CREATE TABLE `finance_managers` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `finance_managers`
--

INSERT INTO `finance_managers` (`id`, `username`, `firstname`, `lastname`, `email`, `phone`, `password`) VALUES
(1, 'Peter', 'Peter', 'Kariuki', 'peterkariuki@gmail.com', '0712345678', '$2b$10$USs3YXoU/4c/pxi.Ol2XxuKRPyxLeBDP/Sx68RQdcoIdw.B5rquFS');

-- --------------------------------------------------------

--
-- Table structure for table `hods`
--

CREATE TABLE `hods` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hods`
--

INSERT INTO `hods` (`id`, `username`, `firstname`, `lastname`, `email`, `phone`, `password`) VALUES
(1, 'Kerren', 'Kerren', 'Maiko', 'kerrenmaiko@gmail.com', '0710560670', '$2b$10$44eZM1ZtWq22crvOpwlPn.PTMq4P9kHoh4haFfG4Q2daPEUrrawp6');

-- --------------------------------------------------------

--
-- Table structure for table `learning_resources`
--

CREATE TABLE `learning_resources` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `resource_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `learning_resources`
--

INSERT INTO `learning_resources` (`id`, `course_id`, `resource_name`, `created_at`) VALUES
(1, 1, 'Kikuyu Beginner Guide (PDF)', '2025-03-25 10:43:19'),
(2, 1, 'Kikuyu Audio Lessons (MP3)', '2025-03-25 10:43:19'),
(3, 1, 'Kikuyu Grammar Workbook', '2025-03-25 10:43:19'),
(4, 2, 'Swahili Basics eBook', '2025-03-25 10:43:19'),
(5, 2, 'Swahili Pronunciation Guide (Audio)', '2025-03-25 10:43:19'),
(6, 2, 'Swahili Conversations (Video)', '2025-03-25 10:43:19'),
(7, 3, 'Arabic Alphabets Chart', '2025-03-25 10:43:19'),
(8, 3, 'Arabic Writing Workbook', '2025-03-25 10:43:19'),
(9, 3, 'Basic Arabic Phrases (MP3)', '2025-03-25 10:43:19'),
(10, 4, 'Gikuyu Vocabulary Flashcards', '2025-03-25 10:43:19'),
(11, 4, 'Gikuyu Cultural Expressions', '2025-03-25 10:43:19'),
(12, 4, 'Gikuyu Phonetics Audio', '2025-03-25 10:43:19'),
(13, 5, 'Luhya Language Guide', '2025-03-25 10:43:19'),
(14, 5, 'Luhya Conversational Phrases', '2025-03-25 10:43:19'),
(15, 5, 'Luhya Songs for Learning', '2025-03-25 10:43:19'),
(16, 6, 'Kalenjin Language Essentials', '2025-03-25 10:43:19'),
(17, 6, 'Kalenjin Speech Training', '2025-03-25 10:43:19'),
(18, 6, 'Kalenjin Audio Lessons', '2025-03-25 10:43:19'),
(19, 7, 'Luo Language Starter Kit', '2025-03-25 10:43:19'),
(20, 7, 'Luo Folktales & Stories', '2025-03-25 10:43:19'),
(21, 7, 'Luo Grammar Reference', '2025-03-25 10:43:19'),
(22, 8, 'Kamba Vocabulary List', '2025-03-25 10:43:19'),
(23, 8, 'Kamba Dialogues (MP3)', '2025-03-25 10:43:19'),
(24, 8, 'Kamba Sentence Structure Guide', '2025-03-25 10:43:19'),
(25, 9, 'Swahili Interactive Course', '2025-03-25 10:43:19'),
(26, 9, 'Swahili Reading Practice', '2025-03-25 10:43:19'),
(27, 9, 'Swahili Songs & Poems', '2025-03-25 10:43:19'),
(28, 10, 'Arabic Online Course Materials', '2025-03-25 10:43:19'),
(29, 10, 'Arabic Writing & Calligraphy', '2025-03-25 10:43:19'),
(30, 10, 'Arabic Religious Texts (PDF)', '2025-03-25 10:43:19'),
(31, 11, 'English Grammar Exercises', '2025-03-25 10:43:19'),
(32, 11, 'English Listening Practice', '2025-03-25 10:43:19'),
(33, 11, 'English Writing Guide', '2025-03-25 10:43:19'),
(34, 12, 'French Language eBook', '2025-03-25 10:43:19'),
(35, 12, 'French Pronunciation Practice', '2025-03-25 10:43:19'),
(36, 12, 'French Short Stories (MP3)', '2025-03-25 10:43:19'),
(37, 13, 'Spanish Beginner’s Handbook', '2025-03-25 10:43:19'),
(38, 13, 'Spanish Interactive Workbook', '2025-03-25 10:43:19'),
(39, 13, 'Spanish Conversations & Phrases', '2025-03-25 10:43:19'),
(40, 14, 'Chinese Pinyin Guide', '2025-03-25 10:43:19'),
(41, 14, 'Chinese Characters Workbook', '2025-03-25 10:43:19'),
(42, 14, 'Chinese Audio Lessons', '2025-03-25 10:43:19');

-- --------------------------------------------------------

--
-- Table structure for table `librarians`
--

CREATE TABLE `librarians` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `librarians`
--

INSERT INTO `librarians` (`id`, `username`, `first_name`, `last_name`, `email`, `password`) VALUES
(1, 'Lanoi', 'Derrick', 'Lanoi', 'derricklanoi@gmail.com', '$2b$10$9JysdLh35QjSKAOIInuhwub1NnXmrdb9zFhQTc8dnqOh/ySXm5viy');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `payment_method` enum('mpesa','bank') NOT NULL,
  `reference_code` varchar(14) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `birth_year` int(11) DEFAULT NULL,
  `id_number` varchar(20) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `amount_paid` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `student_id`, `course_id`, `payment_method`, `reference_code`, `location`, `birth_year`, `id_number`, `status`, `created_at`, `amount_paid`) VALUES
(1, 3, 1, 'mpesa', '12345Df54Q', 'Nairobi ', 2002, '40217945', 'approved', '2025-03-21 06:27:31', 2500.00),
(2, 3, 2, 'mpesa', 'Qwerty23qw', 'Nairobi ', 2002, '40217945', 'pending', '2025-03-21 08:30:28', 3000.00),
(3, 4, 10, 'bank', 'Qwert1234qwert', 'Meru', 20002, '40217945', 'approved', '2025-03-21 08:46:01', 4000.00),
(4, 3, 13, 'mpesa', 'Qwert2346q', 'Nairobi ', 2002, '40217525', 'pending', '2025-03-27 15:26:41', 3750.00),
(5, 3, 1, 'mpesa', 'ABC123XYZ9', NULL, NULL, NULL, 'approved', '2025-03-27 16:07:45', 2000.00),
(6, 4, 10, 'mpesa', 'QWERT54RT4', NULL, NULL, NULL, 'pending', '2025-03-27 18:42:25', 2.00),
(7, 4, 10, 'mpesa', 'QWERT3421R', NULL, NULL, NULL, 'pending', '2025-03-27 18:44:19', 2.00);

-- --------------------------------------------------------

--
-- Table structure for table `resource_requests`
--

CREATE TABLE `resource_requests` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `librarian_submitted` tinyint(1) DEFAULT 0,
  `student_confirmed` tinyint(1) DEFAULT 0,
  `resource_id` int(11) NOT NULL,
  `status` enum('requested','submitted') NOT NULL DEFAULT 'requested'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resource_requests`
--

INSERT INTO `resource_requests` (`id`, `student_id`, `course_id`, `requested_at`, `librarian_submitted`, `student_confirmed`, `resource_id`, `status`) VALUES
(33, 3, 1, '2025-03-26 14:27:17', 1, 0, 3, 'submitted'),
(36, 3, 1, '2025-03-26 17:53:57', 1, 1, 1, 'submitted'),
(37, 4, 10, '2025-03-27 17:58:51', 0, 0, 28, 'requested');

-- --------------------------------------------------------

--
-- Table structure for table `storekeepers`
--

CREATE TABLE `storekeepers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `course_enrolled` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_attendance`
--

CREATE TABLE `student_attendance` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `attended_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_attendance`
--

INSERT INTO `student_attendance` (`id`, `student_id`, `tutor_id`, `course_id`, `attended_at`) VALUES
(8, 3, 1, 1, '2025-03-27 12:54:08');

-- --------------------------------------------------------

--
-- Table structure for table `student_tutors`
--

CREATE TABLE `student_tutors` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('assigned','in_progress','completed') DEFAULT 'assigned',
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_tutors`
--

INSERT INTO `student_tutors` (`id`, `student_id`, `tutor_id`, `assigned_at`, `status`, `course_id`) VALUES
(29, 4, 3, '2025-03-23 15:49:48', 'in_progress', 10),
(31, 3, 1, '2025-03-24 06:37:50', 'completed', 1);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `company` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tutors`
--

CREATE TABLE `tutors` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tutors`
--

INSERT INTO `tutors` (`id`, `username`, `firstname`, `lastname`, `password`, `email`, `phone`) VALUES
(1, 'Mary', 'Mary', 'Murungi', '$2b$10$/sNcDZW.V.gAc4KiMA2ih.4sUSIFEgnBDi2b3lSHIkOv1nDs4elrm', 'marym@example.com', '0712345678'),
(2, 'Mark', 'Mark', 'Karanja', '$2b$10$9Mu0.BQ7nRV3K4ISJLOVWuRoXRai7J.PIweOmmXRmbe9tBQrvvaRm', 'markk@example.com', '0723456789'),
(3, 'Denis', 'Denis', 'Oliech', '$2b$10$hqKp7XZ3mS2Ir7QoQQbdSOxVLMrwJuaprEWMKUrfYEz7GEJgPsE.W', 'deniso@example.com', '0734567890');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `role` enum('student','admin','tutor','supplier','storekeeper','finance_manager','librarian') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `first_name`, `last_name`, `email`, `phone`, `password`, `is_approved`, `role`, `created_at`) VALUES
(1, 'test_user', 'Test', 'User', 'test@example.com', '0712345678', 'hashedpassword123', 1, 'student', '2025-03-20 05:02:27'),
(2, 'Alloys', 'Alloys', 'Maiko', 'maikoa052@gmail.com', '0796901211', '$2b$10$mY29jNBM8oxlP7t6Mbtx4eW2Kcj4i/J.G95SENi8zc4tEZjumCWui', 1, 'student', '2025-03-20 05:11:25'),
(3, 'Phoebe ', 'Phoebe', 'Siaka', 'phoebensiaka@gmail.com', '0745022309', '$2b$10$OpRKu6TL9V0p/d0sFTOam.uIQ4LapW.kLN50WoJ3g0HSaSBIRiYzu', 1, 'student', '2025-03-20 05:36:33'),
(4, 'Alex', 'Alex', 'Maiko', 'Alexmaikogmail.com', '0796901211', '$2b$10$sH/9VMxG1/OwnSYgblyeN.ANiSDsyHP1uVp5Q.Mq3ITPo9BeO2oRu', 1, 'student', '2025-03-20 10:01:44'),
(5, 'Chris ', 'Chris ', 'Maiko', 'Puritysiaka@gmail.com', '0745022309', '$2b$10$BUeNvmnpL8qzpwFo/gS36ej/wVdZvBz1RZ5x1L5csnU6QcPjcGXi2', 1, 'student', '2025-03-20 10:57:01'),
(6, 'John', 'John', 'Mwangi', 'johnmwangi@gmail.com', '0796901210', '$2b$10$y3t3zPCH5HpisO5tvdHZTuaugvo89cUjFqZuZvh3GIuE5ZWah1dAq', 0, 'student', '2025-03-22 17:50:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `finance_managers`
--
ALTER TABLE `finance_managers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `hods`
--
ALTER TABLE `hods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `learning_resources`
--
ALTER TABLE `learning_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `librarians`
--
ALTER TABLE `librarians`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `resource_requests`
--
ALTER TABLE `resource_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `fk_student_id` (`student_id`);

--
-- Indexes for table `storekeepers`
--
ALTER TABLE `storekeepers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_attendance`
--
ALTER TABLE `student_attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `tutor_id` (`tutor_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `student_tutors`
--
ALTER TABLE `student_tutors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `tutor_id` (`tutor_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tutors`
--
ALTER TABLE `tutors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `finance_managers`
--
ALTER TABLE `finance_managers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hods`
--
ALTER TABLE `hods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `learning_resources`
--
ALTER TABLE `learning_resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `librarians`
--
ALTER TABLE `librarians`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `resource_requests`
--
ALTER TABLE `resource_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `storekeepers`
--
ALTER TABLE `storekeepers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_attendance`
--
ALTER TABLE `student_attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `student_tutors`
--
ALTER TABLE `student_tutors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tutors`
--
ALTER TABLE `tutors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `learning_resources`
--
ALTER TABLE `learning_resources`
  ADD CONSTRAINT `learning_resources_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Constraints for table `resource_requests`
--
ALTER TABLE `resource_requests`
  ADD CONSTRAINT `fk_student_id` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `resource_requests_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_attendance`
--
ALTER TABLE `student_attendance`
  ADD CONSTRAINT `student_attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_attendance_ibfk_2` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_attendance_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_tutors`
--
ALTER TABLE `student_tutors`
  ADD CONSTRAINT `student_tutors_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `student_tutors_ibfk_2` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
