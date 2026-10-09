import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import crypto from "crypto";

dotenv.config({ path: ".env.local" });

import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

async function seed() {
  console.log("🌱 Seeding Aroha 2K26 database...");

  // 1. Seed Users
  const adminPassword = hashPassword("admin123");
  const managerPassword = hashPassword("manager123");
  const participantPassword = hashPassword("participant123");

  const [admin] = await db
    .insert(schema.profiles)
    .values({
      userId: "usr_admin_001",
      name: "Aroha Admin",
      email: "admin@aroha2k26.com",
      passwordHash: adminPassword,
      phone: "9876543210",
      college: "Aroha University",
      department: "Fest Convenor Committee",
      role: "ADMIN",
    })
    .onConflictDoNothing()
    .returning();

  const [manager] = await db
    .insert(schema.profiles)
    .values({
      userId: "usr_mgr_001",
      name: "Rohit Verma",
      email: "manager@aroha2k26.com",
      passwordHash: managerPassword,
      phone: "9876543211",
      college: "Aroha University",
      department: "Cultural Secretary",
      year: "4th Year",
      role: "EVENT_MANAGER",
    })
    .onConflictDoNothing()
    .returning();

  const [participant] = await db
    .insert(schema.profiles)
    .values({
      userId: "usr_part_001",
      name: "Ananya Sharma",
      email: "participant@aroha2k26.com",
      passwordHash: participantPassword,
      phone: "9876543212",
      rollNumber: "22ARH042",
      college: "Institute of Technology",
      department: "Computer Science",
      year: "3rd Year",
      role: "PARTICIPANT",
    })
    .onConflictDoNothing()
    .returning();

  console.log("✓ Profiles seeded");

  const managerId = manager?.id || (await db.select().from(schema.profiles).limit(1))[0]?.id;

  // 2. Seed Events
  const sampleEvents = [
    {
      name: "Nritya Tarang (Choreonite)",
      slug: "nritya-tarang",
      category: "CULTURAL" as const,
      description:
        "The flagship inter-college dance showdown of Aroha 2K26! Show off synchronization, high-octane energy, and spellbinding theatrical choreography.",
      rules:
        "1. Team size: 4 - 12 members.\n2. Time limit: 6-8 minutes.\n3. Vulgarity or unsafe props are strictly prohibited.\n4. Soundtrack track must be submitted in pendrive 1 hour prior.",
      venue: "Main Amphitheatre",
      registrationType: "TEAM" as const,
      soloFee: 0,
      teamFee: 500,
      minTeamSize: 4,
      maxTeamSize: 12,
      registrationOpen: new Date("2026-03-01T00:00:00Z"),
      registrationClose: new Date("2026-04-10T23:59:59Z"),
      eventDate: new Date("2026-04-15T17:00:00Z"),
      status: "PUBLISHED" as const,
      eventManagerId: managerId,
    },
    {
      name: "Sur Sangam (Solo & Duet Singing)",
      slug: "sur-sangam",
      category: "CULTURAL" as const,
      description:
        "Unleash the melody within. Classical, semi-classical, Bollywood, and Western vocal melodies take center stage under the festive lights.",
      rules:
        "1. Solo or Duet participation allowed.\n2. Maximum 4 minutes on stage.\n3. One karaoke track or one acoustic instrument accompaniment allowed.",
      venue: "Auditorium Hall A",
      registrationType: "BOTH" as const,
      soloFee: 150,
      teamFee: 250,
      minTeamSize: 1,
      maxTeamSize: 2,
      registrationOpen: new Date("2026-03-01T00:00:00Z"),
      registrationClose: new Date("2026-04-11T23:59:59Z"),
      eventDate: new Date("2026-04-15T11:00:00Z"),
      status: "PUBLISHED" as const,
      eventManagerId: managerId,
    },
    {
      name: "Rann-Bhoomi (Box Cricket)",
      slug: "rann-bhoomi",
      category: "SPORTS" as const,
      description:
        "Fast-paced, electric tennis-ball box cricket tournament under floodlights. High stakes, nail-biting finishes!",
      rules:
        "1. 6 players per team + 2 substitutes.\n2. 5 overs per innings.\n3. Direct hit over the net is out.",
      venue: "Sports Complex Turf 1",
      registrationType: "TEAM" as const,
      soloFee: 0,
      teamFee: 600,
      minTeamSize: 6,
      maxTeamSize: 8,
      registrationOpen: new Date("2026-03-01T00:00:00Z"),
      registrationClose: new Date("2026-04-12T23:59:59Z"),
      eventDate: new Date("2026-04-16T09:00:00Z"),
      status: "PUBLISHED" as const,
      eventManagerId: managerId,
    },
    {
      name: "Drishti (Street Photography)",
      slug: "drishti-photography",
      category: "CREATIVE_MEDIA" as const,
      description:
        "Capture raw festival emotions, candid celebrations, and vibrant campus life through your creative lens.",
      rules:
        "1. Theme revealed on the morning of the event.\n2. RAW file + unedited JPG required.\n3. Post-processing limited to exposure and crop.",
      venue: "Campus-wide / Media Center",
      registrationType: "SOLO" as const,
      soloFee: 100,
      teamFee: 0,
      minTeamSize: 1,
      maxTeamSize: 1,
      registrationOpen: new Date("2026-03-01T00:00:00Z"),
      registrationClose: new Date("2026-04-14T23:59:59Z"),
      eventDate: new Date("2026-04-16T10:00:00Z"),
      status: "PUBLISHED" as const,
      eventManagerId: managerId,
    },
    {
      name: "Zaiqa-e-Campus (Master Chef)",
      slug: "zaiqa-e-campus",
      category: "FOOD_FEST" as const,
      description:
        "Flameless culinary competition testing plating aesthetics, flavor balance, and inventive mocktail presentations.",
      rules:
        "1. 2 participants per team.\n2. Flameless cooking only.\n3. Time limit: 45 minutes preparation.",
      venue: "Open Courtyard Gazebo",
      registrationType: "TEAM" as const,
      soloFee: 0,
      teamFee: 300,
      minTeamSize: 2,
      maxTeamSize: 2,
      registrationOpen: new Date("2026-03-01T00:00:00Z"),
      registrationClose: new Date("2026-04-13T23:59:59Z"),
      eventDate: new Date("2026-04-17T12:00:00Z"),
      status: "PUBLISHED" as const,
      eventManagerId: managerId,
    },
  ];

  for (const ev of sampleEvents) {
    const [insertedEvent] = await db
      .insert(schema.events)
      .values(ev)
      .onConflictDoNothing()
      .returning();

    if (insertedEvent) {
      await db.insert(schema.schedules).values({
        eventId: insertedEvent.id,
        venue: insertedEvent.venue,
        startTime: insertedEvent.eventDate,
        endTime: new Date(insertedEvent.eventDate.getTime() + 3 * 60 * 60 * 1000),
        roundName: "Main Event / Finals",
      });
    }
  }

  console.log("✓ Events and Schedules seeded");
  console.log("🎉 Seed finished successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
