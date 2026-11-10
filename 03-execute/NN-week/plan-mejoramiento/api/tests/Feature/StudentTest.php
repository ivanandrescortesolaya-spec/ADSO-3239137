<?php

namespace Tests\Feature;

use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentTest extends TestCase
{
    use RefreshDatabase;

    public function test_students_can_be_listed(): void
    {
        Student::create([
            'student_code' => 'EST-001',
            'full_name' => 'Carlos Ramirez',
            'email' => 'carlos@example.com',
        ]);

        $response = $this->getJson('/api/students');

        $response->assertOk();

        $response->assertJsonFragment([
            'student_code' => 'EST-001',
        ]);
    }

    public function test_student_can_be_registered(): void
    {
        $response = $this->postJson('/api/students', [
            'student_code' => 'EST-TEST-001',
            'full_name' => 'Estudiante de prueba',
            'email' => 'prueba@example.com',
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('students', [
            'student_code' => 'EST-TEST-001',
            'email' => 'prueba@example.com',
        ]);
    }

    public function test_student_code_must_be_unique(): void
    {
        Student::create([
            'student_code' => 'EST-001',
            'full_name' => 'Carlos Ramirez',
            'email' => 'carlos@example.com',
        ]);

        $response = $this->postJson('/api/students', [
            'student_code' => 'EST-001',
            'full_name' => 'Otro estudiante',
            'email' => 'otro@example.com',
        ]);

        $response->assertUnprocessable();
    }

    public function test_student_email_must_be_valid(): void
    {
        $response = $this->postJson('/api/students', [
            'student_code' => 'EST-TEST-002',
            'full_name' => 'Estudiante de prueba',
            'email' => 'correo-invalido',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('email');
    }

    public function test_student_can_be_updated(): void
    {
        $student = Student::create([
            'student_code' => 'EST-001',
            'full_name' => 'Carlos Ramirez',
            'email' => 'carlos@example.com',
        ]);

        $response = $this->putJson('/api/students/' . $student->id, [
            'student_code' => 'EST-001',
            'full_name' => 'Carlos Actualizado',
            'email' => 'carlos@example.com',
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'full_name' => 'Carlos Actualizado',
        ]);
    }

    public function test_student_can_be_consulted_with_its_loans(): void
    {
        $student = Student::create([
            'student_code' => 'EST-001',
            'full_name' => 'Carlos Ramirez',
            'email' => 'carlos@example.com',
        ]);

        $response = $this->getJson('/api/students/' . $student->id);

        $response->assertOk();

        $response->assertJsonPath(
            'data.student_code',
            'EST-001'
        );
    }

    public function test_nonexistent_student_returns_404(): void
    {
        $response = $this->getJson('/api/students/99999');

        $response->assertNotFound();
    }
}
