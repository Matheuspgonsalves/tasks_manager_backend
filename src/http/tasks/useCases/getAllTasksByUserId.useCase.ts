import prisma from "../../../configs/database"

export const findAllTasksByUserId = async (id: string) => {
	if (!id || id.trim() === "") { 
		return {error: "User ID required"}
	}

	const getTaskByUserId = await prisma.tasks.findMany({
		where: { userId: id},
		include: {
			category: true,
		},
	});

	return { tasks: getTaskByUserId };
}
